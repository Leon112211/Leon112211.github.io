#include "gary_controller/dual_loop_pid_controller_with_filter.hpp"


using namespace gary_controller;


DualLoopPIDControllerWithFilter::DualLoopPIDControllerWithFilter() : controller_interface::ControllerInterface(),
                                 pid(),
                                 stale_threshold(),
                                 cmd_subscription(nullptr),
                                 cmd_buffer(nullptr),
                                 last_cmd_time() {}

controller_interface::return_type DualLoopPIDControllerWithFilter::init(const std::string &controller_name) {

    //call the base class initializer
    auto ret = ControllerInterface::init(controller_name);
    if (ret != controller_interface::return_type::OK) return ret;

    this->auto_declare("inner_command_interface", "");
    this->auto_declare("inner_state_interface", "");
    this->auto_declare("inner_kp", 0.0f);
    this->auto_declare("inner_ki", 0.0f);
    this->auto_declare("inner_kd", 0.0f);
    this->auto_declare("inner_max_out", 0.0f);
    this->auto_declare("inner_max_iout", 0.0f);
    this->auto_declare("inner_p_filter_coefficient", 0.0f);
    this->auto_declare("inner_d_filter_coefficient", 0.0f);

    this->auto_declare("outer_state_interface", "");
    this->auto_declare("outer_kp", 0.0f);
    this->auto_declare("outer_ki", 0.0f);
    this->auto_declare("outer_kd", 0.0f);
    this->auto_declare("outer_max_out", 0.0f);
    this->auto_declare("outer_max_iout", 0.0f);
    this->auto_declare("outer_p_filter_coefficient", 0.0f);
    this->auto_declare("outer_d_filter_coefficient", 0.0f);

    this->auto_declare("stale_threshold", 0.1f);

    return controller_interface::return_type::OK;
}


controller_interface::InterfaceConfiguration DualLoopPIDControllerWithFilter::state_interface_configuration() const {

    controller_interface::InterfaceConfiguration state_interfaces_config;
    state_interfaces_config.type = controller_interface::interface_configuration_type::INDIVIDUAL;

    state_interfaces_config.names.emplace_back(this->inner_state_interface);
    state_interfaces_config.names.emplace_back(this->outer_state_interface);

    return state_interfaces_config;
}


controller_interface::InterfaceConfiguration DualLoopPIDControllerWithFilter::command_interface_configuration() const {

    controller_interface::InterfaceConfiguration command_interfaces_config;
    command_interfaces_config.type = controller_interface::interface_configuration_type::INDIVIDUAL;

    command_interfaces_config.names.emplace_back(this->inner_command_interface);

    return command_interfaces_config;
}


CallbackReturn DualLoopPIDControllerWithFilter::on_configure(const rclcpp_lifecycle::State &previous_state) {
    RCL_UNUSED(previous_state);

    RCLCPP_DEBUG(this->get_node()->get_logger(), "configuring");

    //get parameter: inner_command_interface
    this->inner_command_interface = this->get_node()->get_parameter("inner_command_interface").as_string();

    //get parameter: inner_state_interface
    this->inner_state_interface = this->get_node()->get_parameter("inner_state_interface").as_string();

    //get parameter: inner_kp
    this->pid.inner_kp = this->get_node()->get_parameter("inner_kp").as_double();

    //get parameter: inner_ki
    this->pid.inner_ki = this->get_node()->get_parameter("inner_ki").as_double();

    //get parameter: inner_kd
    this->pid.inner_kd = this->get_node()->get_parameter("inner_kd").as_double();

    //get parameter: inner_max_out
    this->pid.inner_max_out = this->get_node()->get_parameter("inner_max_out").as_double();

    //get parameter: inner_max_iout
    this->pid.inner_max_iout = this->get_node()->get_parameter("inner_max_iout").as_double();

    //get parameter: inner_p_filter_coefficient
    this->pid.inner_p_filter_coefficient = this->get_node()->get_parameter("inner_p_filter_coefficient").as_double();

    //get parameter: inner_d_filter_coefficient
    this->pid.inner_d_filter_coefficient = this->get_node()->get_parameter("inner_d_filter_coefficient").as_double();

    //get parameter: outer_state_interface
    this->outer_state_interface = this->get_node()->get_parameter("outer_state_interface").as_string();

    //get parameter: outer_kp
    this->pid.outer_kp = this->get_node()->get_parameter("outer_kp").as_double();

    //get parameter: outer_ki
    this->pid.outer_ki = this->get_node()->get_parameter("outer_ki").as_double();

    //get parameter: outer_kd
    this->pid.outer_kd = this->get_node()->get_parameter("outer_kd").as_double();

    //get parameter: outer_max_out
    this->pid.outer_max_out = this->get_node()->get_parameter("outer_max_out").as_double();

    //get parameter: outer_max_iout
    this->pid.outer_max_iout = this->get_node()->get_parameter("outer_max_iout").as_double();

    //get parameter: outer_p_filter_coefficient
    this->pid.outer_p_filter_coefficient = this->get_node()->get_parameter("outer_p_filter_coefficient").as_double();

    //get parameter: outer_d_filter_coefficient
    this->pid.outer_d_filter_coefficient = this->get_node()->get_parameter("outer_d_filter_coefficient").as_double();

    //get parameter: offline_threshold
    this->stale_threshold = this->get_node()->get_parameter("stale_threshold").as_double();

    RCLCPP_DEBUG(this->get_node()->get_logger(), "inner_command_interface: %s, inner_state_interface: %s",
                this->inner_command_interface.c_str(), this->inner_state_interface.c_str());

    RCLCPP_DEBUG(this->get_node()->get_logger(), "inner_kp %f, inner_ki %f, inner_kd %f, inner_max_iout %f, inner_max_out %f",
                this->pid.inner_kp, this->pid.inner_ki, this->pid.inner_kd, this->pid.inner_max_iout, this->pid.inner_max_out);

    RCLCPP_DEBUG(this->get_node()->get_logger(), "outer_state_interface: %s stale_threshold %f",
                this->outer_state_interface.c_str(), this->stale_threshold);

    RCLCPP_DEBUG(this->get_node()->get_logger(), "outer_kp %f, outer_ki %f, outer_kd %f, outer_max_iout %f, outer_max_out %f",
                this->pid.outer_kp, this->pid.outer_ki, this->pid.outer_kd, this->pid.outer_max_iout, this->pid.outer_max_out);

    //create command subscriber
    this->cmd_subscription = this->get_node()->create_subscription<std_msgs::msg::Float64>("~/cmd",
                                                                                           rclcpp::SystemDefaultsQoS(),
                                                                                           [this](const std_msgs::msg::Float64::SharedPtr msg) {
                                                                                               cmd_buffer.writeFromNonRT(
                                                                                                       msg);
                                                                                               this->last_cmd_time = this->get_node()->get_clock()->now().seconds();
                                                                                           });
    //create pid publisher
    auto pid_publisher_ = this->get_node()->create_publisher<gary_msgs::msg::DualLoopPIDWithFilter>("~/pid", rclcpp::SystemDefaultsQoS());
    this->pid_publisher = std::make_unique<realtime_tools::RealtimePublisher<gary_msgs::msg::DualLoopPIDWithFilter>>(pid_publisher_);
    this->pid_publisher->unlock();

    //creat param callback
    this->callback_handle_ = this->get_node()->add_on_set_parameters_callback(
            std::bind(&DualLoopPIDControllerWithFilter::parametersCallback, this, std::placeholders::_1));

    RCLCPP_INFO(this->get_node()->get_logger(), "configured");
    return CallbackReturn::SUCCESS;
}


CallbackReturn DualLoopPIDControllerWithFilter::on_activate(const rclcpp_lifecycle::State &previous_state) {
    RCL_UNUSED(previous_state);

    RCLCPP_DEBUG(this->get_node()->get_logger(), "activating");

    std_msgs::msg::Float64 msg;
    msg.data = 0.0f;
    this->cmd_buffer.writeFromNonRT(std::make_shared<std_msgs::msg::Float64>(msg));

    RCLCPP_INFO(this->get_node()->get_logger(), "activated");

    return CallbackReturn::SUCCESS;
}


CallbackReturn DualLoopPIDControllerWithFilter::on_deactivate(const rclcpp_lifecycle::State &previous_state) {
    RCL_UNUSED(previous_state);

    RCLCPP_DEBUG(this->get_node()->get_logger(), "deactivating");


    RCLCPP_INFO(this->get_node()->get_logger(), "deactivated");

    return CallbackReturn::SUCCESS;
}


controller_interface::return_type DualLoopPIDControllerWithFilter::update() {
    RCLCPP_DEBUG(this->get_node()->get_logger(), "updating");

    //publish
    if (this->pid_publisher->trylock()) {
        this->pid_publisher->msg_ = this->pid;
        this->pid_publisher->msg_.header.frame_id = "";
        this->pid_publisher->msg_.header.stamp = this->get_node()->get_clock()->now();
        this->pid_publisher->unlockAndPublish();
    }

    //get control command
    auto command = this->cmd_buffer.readFromRT()->get();

    //check if cmd is stale
    if (this->get_node()->get_clock()->now().seconds() - this->last_cmd_time > this->stale_threshold) {
        this->pid.inner_set = 0;
        this->pid.inner_feedback = this->state_interfaces_[0].get_value();
        this->pid.inner_error = 0;
        this->pid.inner_error_sum = 0;
        this->pid.inner_last_error = 0;
        this->pid.inner_pout = 0;
        this->pid.inner_iout = 0;
        this->pid.inner_dout = 0;
        this->pid.inner_out = 0;

        this->pid.outer_set = 0;
        this->pid.outer_feedback = this->state_interfaces_[1].get_value();
        this->pid.outer_error = 0;
        this->pid.outer_error_sum = 0;
        this->pid.outer_last_error = 0;
        this->pid.outer_pout = 0;
        this->pid.outer_iout = 0;
        this->pid.outer_dout = 0;
        this->pid.outer_out = 0;

        this->command_interfaces_[0].set_value(0);
        return controller_interface::return_type::OK;
    }


    this->pid.outer_set = command->data;
    this->pid.outer_feedback = this->state_interfaces_[1].get_value();
    this->pid.outer_error = this->pid.outer_set - this->pid.outer_feedback;

    // p
    this->pid.outer_pout = this->pid.outer_p_filter_coefficient * this->pid.outer_pout +
                     (1 - this->pid.outer_p_filter_coefficient) * this->pid.outer_error * this->pid.outer_kp;
    // i
    this->pid.outer_error_sum += this->pid.outer_error;
    this->pid.outer_iout = this->pid.outer_error_sum * this->pid.outer_ki;
    if (this->pid.outer_iout > this->pid.outer_max_iout) this->pid.outer_iout = this->pid.outer_max_iout;
    if (this->pid.outer_iout < -this->pid.outer_max_iout) this->pid.outer_iout = -this->pid.outer_max_iout;
    // d
    this->pid.outer_dout = this->pid.outer_d_filter_coefficient * this->pid.outer_dout +
                     (1 - this->pid.outer_d_filter_coefficient) * (this->pid.outer_error - this->pid.outer_last_error) * this->pid.outer_kd;
    this->pid.outer_last_error = this->pid.outer_error;
    //sum
    this->pid.outer_out = this->pid.outer_pout + this->pid.outer_iout + this->pid.outer_dout;
    if (this->pid.outer_out > this->pid.outer_max_out) this->pid.outer_out = this->pid.outer_max_out;
    if (this->pid.outer_out < -this->pid.outer_max_out) this->pid.outer_out = -this->pid.outer_max_out;


    this->pid.inner_set = this->pid.outer_out;
    this->pid.inner_feedback = this->state_interfaces_[0].get_value();
    this->pid.inner_error = this->pid.inner_set - this->pid.inner_feedback;

    // p
    this->pid.inner_pout = this->pid.inner_p_filter_coefficient * this->pid.inner_pout +
                           (1 - this->pid.inner_p_filter_coefficient) * this->pid.inner_error * this->pid.inner_kp;
    // i
    this->pid.inner_error_sum += this->pid.inner_error;
    this->pid.inner_iout = this->pid.inner_error_sum * this->pid.inner_ki;
    if (this->pid.inner_iout > this->pid.inner_max_iout) this->pid.inner_iout = this->pid.inner_max_iout;
    if (this->pid.inner_iout < -this->pid.inner_max_iout) this->pid.inner_iout = -this->pid.inner_max_iout;
    // d
    this->pid.inner_dout = this->pid.inner_d_filter_coefficient * this->pid.inner_dout +
                           (1 - this->pid.inner_d_filter_coefficient) * (this->pid.inner_error - this->pid.inner_last_error) * this->pid.inner_kd;
    this->pid.inner_last_error = this->pid.inner_error;
    //sum
    this->pid.inner_out = this->pid.inner_pout + this->pid.inner_iout + this->pid.inner_dout;
    if (this->pid.inner_out > this->pid.inner_max_out) this->pid.inner_out = this->pid.inner_max_out;
    if (this->pid.inner_out < -this->pid.inner_max_out) this->pid.inner_out = -this->pid.inner_max_out;

    this->command_interfaces_[0].set_value(this->pid.inner_out);

    return controller_interface::return_type::OK;
}


rcl_interfaces::msg::SetParametersResult
DualLoopPIDControllerWithFilter::parametersCallback(const std::vector<rclcpp::Parameter> &parameters) {
    for (const auto &i: parameters) {
        if (i.get_name() == "inner_kp" && i.get_type() == rcl_interfaces::msg::ParameterType::PARAMETER_DOUBLE) {
            this->pid.inner_kp = i.as_double();
            RCLCPP_INFO(this->get_node()->get_logger(), "update param inner_kp %f", this->pid.inner_kp);
        }
        if (i.get_name() == "inner_ki" && i.get_type() == rcl_interfaces::msg::ParameterType::PARAMETER_DOUBLE) {
            this->pid.inner_ki = i.as_double();
            RCLCPP_INFO(this->get_node()->get_logger(), "update param inner_ki %f", this->pid.inner_ki);
        }
        if (i.get_name() == "inner_kd" && i.get_type() == rcl_interfaces::msg::ParameterType::PARAMETER_DOUBLE) {
            this->pid.inner_kd = i.as_double();
            RCLCPP_INFO(this->get_node()->get_logger(), "update param inner_kd %f", this->pid.inner_kd);
        }
        if (i.get_name() == "inner_max_out" && i.get_type() == rcl_interfaces::msg::ParameterType::PARAMETER_DOUBLE) {
            this->pid.inner_max_out = i.as_double();
            RCLCPP_INFO(this->get_node()->get_logger(), "update param inner_max_out %f", this->pid.inner_max_out);
        }
        if (i.get_name() == "inner_max_iout" && i.get_type() == rcl_interfaces::msg::ParameterType::PARAMETER_DOUBLE) {
            this->pid.inner_max_iout = i.as_double();
            RCLCPP_INFO(this->get_node()->get_logger(), "update param inner_max_iout %f", this->pid.inner_max_iout);
        }
        if (i.get_name() == "inner_p_filter_coefficient" && i.get_type() == rcl_interfaces::msg::ParameterType::PARAMETER_DOUBLE) {
            this->pid.inner_p_filter_coefficient = i.as_double();
            RCLCPP_INFO(this->get_node()->get_logger(), "update param inner_p_filter_coefficient %f", this->pid.inner_p_filter_coefficient);
        }
        if (i.get_name() == "inner_d_filter_coefficient" && i.get_type() == rcl_interfaces::msg::ParameterType::PARAMETER_DOUBLE) {
            this->pid.inner_d_filter_coefficient = i.as_double();
            RCLCPP_INFO(this->get_node()->get_logger(), "update param inner_d_filter_coefficient %f", this->pid.inner_d_filter_coefficient);
        }
        if (i.get_name() == "outer_kp" && i.get_type() == rcl_interfaces::msg::ParameterType::PARAMETER_DOUBLE) {
            this->pid.outer_kp = i.as_double();
            RCLCPP_INFO(this->get_node()->get_logger(), "update param outer_kp %f", this->pid.outer_kp);
        }
        if (i.get_name() == "outer_ki" && i.get_type() == rcl_interfaces::msg::ParameterType::PARAMETER_DOUBLE) {
            this->pid.outer_ki = i.as_double();
            RCLCPP_INFO(this->get_node()->get_logger(), "update param outer_ki %f", this->pid.outer_ki);
        }
        if (i.get_name() == "outer_kd" && i.get_type() == rcl_interfaces::msg::ParameterType::PARAMETER_DOUBLE) {
            this->pid.outer_kd = i.as_double();
            RCLCPP_INFO(this->get_node()->get_logger(), "update param outer_kd %f", this->pid.outer_kd);
        }
        if (i.get_name() == "outer_max_out" && i.get_type() == rcl_interfaces::msg::ParameterType::PARAMETER_DOUBLE) {
            this->pid.outer_max_out = i.as_double();
            RCLCPP_INFO(this->get_node()->get_logger(), "update param outer_max_out %f", this->pid.outer_max_out);
        }
        if (i.get_name() == "outer_max_iout" && i.get_type() == rcl_interfaces::msg::ParameterType::PARAMETER_DOUBLE) {
            this->pid.outer_max_iout = i.as_double();
            RCLCPP_INFO(this->get_node()->get_logger(), "update param outer_max_iout %f", this->pid.outer_max_iout);
        }
        if (i.get_name() == "outer_p_filter_coefficient" && i.get_type() == rcl_interfaces::msg::ParameterType::PARAMETER_DOUBLE) {
            this->pid.outer_p_filter_coefficient = i.as_double();
            RCLCPP_INFO(this->get_node()->get_logger(), "update param outer_p_filter_coefficient %f", this->pid.outer_p_filter_coefficient);
        }
        if (i.get_name() == "outer_d_filter_coefficient" && i.get_type() == rcl_interfaces::msg::ParameterType::PARAMETER_DOUBLE) {
            this->pid.outer_d_filter_coefficient = i.as_double();
            RCLCPP_INFO(this->get_node()->get_logger(), "update param outer_d_filter_coefficient %f", this->pid.outer_d_filter_coefficient);
        }
    }

    rcl_interfaces::msg::SetParametersResult result;
    result.successful = true;
    result.reason = "success";
    return result;
}


#include "pluginlib/class_list_macros.hpp"

PLUGINLIB_EXPORT_CLASS(gary_controller::DualLoopPIDControllerWithFilter, controller_interface::ControllerInterface)
