#include "gary_controller/calibration_controller.hpp"


using namespace gary_controller;


controller_interface::return_type CalibrationController::init(const std::string &controller_name) {

    //call the base class initializer
    auto ret = ControllerInterface::init(controller_name);
    if (ret != controller_interface::return_type::OK) return ret;

    this->auto_declare("interface_name", "reset_position");
    this->auto_declare("motor_names", std::vector<std::string>());

    return controller_interface::return_type::OK;
}


controller_interface::InterfaceConfiguration CalibrationController::state_interface_configuration() const {

    controller_interface::InterfaceConfiguration state_interfaces_config;
    state_interfaces_config.type = controller_interface::interface_configuration_type::NONE;

    return state_interfaces_config;
}


controller_interface::InterfaceConfiguration CalibrationController::command_interface_configuration() const {

    controller_interface::InterfaceConfiguration command_interfaces_config;
    command_interfaces_config.type = controller_interface::interface_configuration_type::INDIVIDUAL;
    for(const auto& i : this->motor_names) {
        command_interfaces_config.names.emplace_back(i + "/" + this->interface_name);
    }

    return command_interfaces_config;
}


CallbackReturn CalibrationController::on_configure(const rclcpp_lifecycle::State &previous_state) {
    RCL_UNUSED(previous_state);

    RCLCPP_DEBUG(this->get_node()->get_logger(), "configuring");

    //get parameter: interface_name
    this->interface_name = this->get_node()->get_parameter("interface_name").as_string();

    //get parameter: motor_names
    this->motor_names = this->get_node()->get_parameter("motor_names").as_string_array();

    this->service = this->get_node()->create_service<gary_msgs::srv::ResetMotorPosition>("/reset_motor_position", std::bind(&CalibrationController::service_callback,
                                                                                                                            this, std::placeholders::_1,std::placeholders::_2));

    RCLCPP_INFO(this->get_node()->get_logger(), "configured");
    return CallbackReturn::SUCCESS;
}


CallbackReturn CalibrationController::on_activate(const rclcpp_lifecycle::State &previous_state) {
    RCL_UNUSED(previous_state);

    RCLCPP_DEBUG(this->get_node()->get_logger(), "activating");

    RCLCPP_INFO(this->get_node()->get_logger(), "activated");

    return CallbackReturn::SUCCESS;
}


CallbackReturn CalibrationController::on_deactivate(const rclcpp_lifecycle::State &previous_state) {
    RCL_UNUSED(previous_state);

    RCLCPP_DEBUG(this->get_node()->get_logger(), "deactivating");

    RCLCPP_INFO(this->get_node()->get_logger(), "deactivated");

    return CallbackReturn::SUCCESS;
}


controller_interface::return_type CalibrationController::update() {
    RCLCPP_DEBUG(this->get_node()->get_logger(), "updating");

    return controller_interface::return_type::OK;
}

void CalibrationController::service_callback(std::shared_ptr<gary_msgs::srv::ResetMotorPosition::Request> request,
                      std::shared_ptr<gary_msgs::srv::ResetMotorPosition::Response> response)
{
    for (auto &i : this->command_interfaces_) {
        if (i.get_name() == request->motor_name) {
            i.set_value(1.0f);
            response->succ = true;
            RCLCPP_INFO(this->get_node()->get_logger(), "resetting %s motor position", i.get_name().c_str());
            return;
        }
    }

    response->succ = false;
    RCLCPP_INFO(this->get_node()->get_logger(), "failed to find %s motor interface", request->motor_name.c_str());
}


#include "pluginlib/class_list_macros.hpp"

PLUGINLIB_EXPORT_CLASS(gary_controller::CalibrationController, controller_interface::ControllerInterface)