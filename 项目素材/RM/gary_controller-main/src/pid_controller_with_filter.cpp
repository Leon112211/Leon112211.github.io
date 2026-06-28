#include "gary_controller/pid_controller_with_filter.hpp"


using namespace gary_controller;


PIDControllerWithFilter::PIDControllerWithFilter() : controller_interface::ControllerInterface(),
                                 pid(),
                                 stale_threshold(),
                                 cmd_subscription(nullptr),
                                 cmd_buffer(nullptr),
                                 last_cmd_time() {}

controller_interface::return_type PIDControllerWithFilter::init(const std::string &controller_name) {

    //call the base class initializer
    auto ret = ControllerInterface::init(controller_name);
    if (ret != controller_interface::return_type::OK) return ret;

    this->auto_declare("command_interface", "");
    this->auto_declare("state_interface", "");
    this->auto_declare("kp", 0.0f);
    this->auto_declare("ki", 0.0f);
    this->auto_declare("kd", 0.0f);
    this->auto_declare("p_filter_coefficient", 0.0f);
    this->auto_declare("d_filter_coefficient", 0.0f);
    this->auto_declare("max_out", 0.0f);
    this->auto_declare("max_iout", 0.0f);
    this->auto_declare("stale_threshold", 0.1f);

    return controller_interface::return_type::OK;
}


controller_interface::InterfaceConfiguration PIDControllerWithFilter::state_interface_configuration() const {

    controller_interface::InterfaceConfiguration state_interfaces_config;
    state_interfaces_config.type = controller_interface::interface_configuration_type::INDIVIDUAL;

    state_interfaces_config.names.emplace_back(this->state_interface_name);

    return state_interfaces_config;
}


controller_interface::InterfaceConfiguration PIDControllerWithFilter::command_interface_configuration() const {

    controller_interface::InterfaceConfiguration command_interfaces_config;
    command_interfaces_config.type = controller_interface::interface_configuration_type::INDIVIDUAL;

    command_interfaces_config.names.emplace_back(this->command_interface_name);

    return command_interfaces_config;
}


CallbackReturn PIDControllerWithFilter::on_configure(const rclcpp_lifecycle::State &previous_state) {
    RCL_UNUSED(previous_state);

    RCLCPP_DEBUG(this->get_node()->get_logger(), "configuring");

    //get parameter: command_interface
    this->command_interface_name = this->get_node()->get_parameter("command_interface").as_string();

    //get parameter: state_interface
    this->state_interface_name = this->get_node()->get_parameter("state_interface").as_string();

    //get parameter: kp
    this->pid.kp = this->get_node()->get_parameter("kp").as_double();

    //get parameter: ki
    this->pid.ki = this->get_node()->get_parameter("ki").as_double();

    //get parameter: kd
    this->pid.kd = this->get_node()->get_parameter("kd").as_double();

    //get parameter: max_out
    this->pid.max_out = this->get_node()->get_parameter("max_out").as_double();

    //get parameter: p_filter_coefficient
    this->pid.p_filter_coefficient = this->get_node()->get_parameter("p_filter_coefficient").as_double();

    //get parameter: d_filter_coefficient
    this->pid.d_filter_coefficient = this->get_node()->get_parameter("d_filter_coefficient").as_double();

    //get parameter: max_iout
    this->pid.max_iout = this->get_node()->get_parameter("max_iout").as_double();

    //get parameter: offline_threshold
    this->stale_threshold = this->get_node()->get_parameter("stale_threshold").as_double();

    RCLCPP_DEBUG(this->get_node()->get_logger(), "command_interface: %s, state_interface: %s stale_threshold %f",
                this->command_interface_name.c_str(), this->state_interface_name.c_str(), this->stale_threshold);

    RCLCPP_DEBUG(this->get_node()->get_logger(), "kp %f, ki %f, kd %f, max_iout %f, max_out %f",
                this->pid.kp, this->pid.ki, this->pid.kd, this->pid.max_iout, this->pid.max_out);

    //create command subscriber
    this->cmd_subscription = this->get_node()->create_subscription<std_msgs::msg::Float64>("~/cmd",
                                                                                           rclcpp::SystemDefaultsQoS(),
                                                                                           [this](const std_msgs::msg::Float64::SharedPtr msg) {
                                                                                               cmd_buffer.writeFromNonRT(
                                                                                                       msg);
                                                                                               this->last_cmd_time = this->get_node()->get_clock()->now().seconds();
                                                                                           });
    //create pid publisher
    auto pid_publisher_ = this->get_node()->create_publisher<gary_msgs::msg::PIDWithFilter>("~/pid", rclcpp::SystemDefaultsQoS());
    this->pid_publisher = std::make_unique<realtime_tools::RealtimePublisher<gary_msgs::msg::PIDWithFilter>>(pid_publisher_);
    this->pid_publisher->unlock();

    //creat param callback
    this->callback_handle_ = this->get_node()->add_on_set_parameters_callback(
            std::bind(&PIDControllerWithFilter::parametersCallback, this, std::placeholders::_1));

    RCLCPP_INFO(this->get_node()->get_logger(), "configured");
    return CallbackReturn::SUCCESS;
}


CallbackReturn PIDControllerWithFilter::on_activate(const rclcpp_lifecycle::State &previous_state) {
    RCL_UNUSED(previous_state);

    RCLCPP_DEBUG(this->get_node()->get_logger(), "activating");

    std_msgs::msg::Float64 msg;
    msg.data = 0.0f;
    this->cmd_buffer.writeFromNonRT(std::make_shared<std_msgs::msg::Float64>(msg));

    RCLCPP_INFO(this->get_node()->get_logger(), "activated");

    return CallbackReturn::SUCCESS;
}


CallbackReturn PIDControllerWithFilter::on_deactivate(const rclcpp_lifecycle::State &previous_state) {
    RCL_UNUSED(previous_state);

    RCLCPP_DEBUG(this->get_node()->get_logger(), "deactivating");


    RCLCPP_INFO(this->get_node()->get_logger(), "deactivated");

    return CallbackReturn::SUCCESS;
}


controller_interface::return_type PIDControllerWithFilter::update() {
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
        this->pid.set = 0;
        this->pid.feedback = this->state_interfaces_[0].get_value();
        this->pid.error = 0;
        this->pid.error_sum = 0;
        this->pid.last_error = 0;
        this->pid.pout = 0;
        this->pid.iout = 0;
        this->pid.dout = 0;
        this->pid.out = 0;
        this->command_interfaces_[0].set_value(0);
        return controller_interface::return_type::OK;
    }


    this->pid.set = command->data;
    this->pid.feedback = this->state_interfaces_[0].get_value();
    this->pid.error = this->pid.set - this->pid.feedback;

    // p
    this->pid.pout = this->pid.p_filter_coefficient * this->pid.pout +
            (1 - this->pid.p_filter_coefficient) * this->pid.error * this->pid.kp;
    // i
    this->pid.error_sum += this->pid.error;
    this->pid.iout = this->pid.error_sum * this->pid.ki;
    if (this->pid.iout > this->pid.max_iout) this->pid.iout = this->pid.max_iout;
    if (this->pid.iout < -this->pid.max_iout) this->pid.iout = -this->pid.max_iout;
    // d
    this->pid.dout = this->pid.d_filter_coefficient * this->pid.dout +
                     (1 - this->pid.d_filter_coefficient) * (this->pid.error - this->pid.last_error) * this->pid.kd;
    this->pid.last_error = this->pid.error;
    //sum
    this->pid.out = this->pid.pout + this->pid.iout + this->pid.dout;
    if (this->pid.out > this->pid.max_out) this->pid.out = this->pid.max_out;
    if (this->pid.out < -this->pid.max_out) this->pid.out = -this->pid.max_out;

    this->command_interfaces_[0].set_value(this->pid.out);

    return controller_interface::return_type::OK;
}


rcl_interfaces::msg::SetParametersResult
PIDControllerWithFilter::parametersCallback(const std::vector<rclcpp::Parameter> &parameters) {
    for (const auto &i: parameters) {
        if (i.get_name() == "kp" && i.get_type() == rcl_interfaces::msg::ParameterType::PARAMETER_DOUBLE) {
            this->pid.kp = i.as_double();
            RCLCPP_INFO(this->get_node()->get_logger(), "update param kp %f", this->pid.kp);
        }
        if (i.get_name() == "ki" && i.get_type() == rcl_interfaces::msg::ParameterType::PARAMETER_DOUBLE) {
            this->pid.ki = i.as_double();
            RCLCPP_INFO(this->get_node()->get_logger(), "update param ki %f", this->pid.ki);
        }
        if (i.get_name() == "kd" && i.get_type() == rcl_interfaces::msg::ParameterType::PARAMETER_DOUBLE) {
            this->pid.kd = i.as_double();
            RCLCPP_INFO(this->get_node()->get_logger(), "update param kd %f", this->pid.kd);
        }
        if (i.get_name() == "max_out" && i.get_type() == rcl_interfaces::msg::ParameterType::PARAMETER_DOUBLE) {
            this->pid.max_out = i.as_double();
            RCLCPP_INFO(this->get_node()->get_logger(), "update param max_out %f", this->pid.max_out);
        }
        if (i.get_name() == "max_iout" && i.get_type() == rcl_interfaces::msg::ParameterType::PARAMETER_DOUBLE) {
            this->pid.max_iout = i.as_double();
            RCLCPP_INFO(this->get_node()->get_logger(), "update param max_iout %f", this->pid.max_iout);
        }
        if (i.get_name() == "p_filter_coefficient" && i.get_type() == rcl_interfaces::msg::ParameterType::PARAMETER_DOUBLE) {
            this->pid.p_filter_coefficient = i.as_double();
            RCLCPP_INFO(this->get_node()->get_logger(), "update param p_filter_coefficient %f", this->pid.p_filter_coefficient);
        }
        if (i.get_name() == "d_filter_coefficient" && i.get_type() == rcl_interfaces::msg::ParameterType::PARAMETER_DOUBLE) {
            this->pid.d_filter_coefficient = i.as_double();
            RCLCPP_INFO(this->get_node()->get_logger(), "update param d_filter_coefficient %f", this->pid.d_filter_coefficient);
        }
    }

    rcl_interfaces::msg::SetParametersResult result;
    result.successful = true;
    result.reason = "success";
    return result;
}


#include "pluginlib/class_list_macros.hpp"

PLUGINLIB_EXPORT_CLASS(gary_controller::PIDControllerWithFilter, controller_interface::ControllerInterface)
