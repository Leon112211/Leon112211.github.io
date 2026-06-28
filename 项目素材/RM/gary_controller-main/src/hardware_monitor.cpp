#include "gary_controller/hardware_monitor.hpp"


using namespace gary_controller;


HardwareMonitor::HardwareMonitor() : overheat_threshold(0.0f), pub_rate(10.0f), publisher(), flag_publish(false) {}

controller_interface::return_type HardwareMonitor::init(const std::string &controller_name) {

    //call the base class initializer
    auto ret = ControllerInterface::init(controller_name);
    if (ret != controller_interface::return_type::OK) return ret;

    this->auto_declare("offline_interface_name", "offline");
    this->auto_declare("temperature_interface_name", "temperature");
    this->auto_declare("overheat_threshold", 80.0f);
    this->auto_declare("diagnose_topic", "/diagnostics");
    this->auto_declare("pub_rate", 10.0f);

    return controller_interface::return_type::OK;
}


controller_interface::InterfaceConfiguration HardwareMonitor::state_interface_configuration() const {

    controller_interface::InterfaceConfiguration state_interfaces_config;
    state_interfaces_config.type = controller_interface::interface_configuration_type::ALL;

    return state_interfaces_config;
}


controller_interface::InterfaceConfiguration HardwareMonitor::command_interface_configuration() const {

    controller_interface::InterfaceConfiguration command_interfaces_config;
    command_interfaces_config.type = controller_interface::interface_configuration_type::NONE;

    return command_interfaces_config;
}


CallbackReturn HardwareMonitor::on_configure(const rclcpp_lifecycle::State &previous_state) {
    RCL_UNUSED(previous_state);

    RCLCPP_DEBUG(this->get_node()->get_logger(), "configuring");

    //get parameter: offline_interface_name
    this->offline_interface_name = this->get_node()->get_parameter("offline_interface_name").as_string();

    //get parameter: temperature_interface_name
    this->temperature_interface_name = this->get_node()->get_parameter("temperature_interface_name").as_string();

    //get parameter: overheat_threshold
    this->overheat_threshold = this->get_node()->get_parameter("overheat_threshold").as_double();

    //get parameter: diagnose_topic
    this->diagnose_topic = this->get_node()->get_parameter("diagnose_topic").as_string();

    //get parameter: pub_rate
    this->pub_rate = this->get_node()->get_parameter("pub_rate").as_double();

    //create publisher
    auto publisher_ = this->get_node()->create_publisher<diagnostic_msgs::msg::DiagnosticArray>(this->diagnose_topic,
                                                                                                rclcpp::SystemDefaultsQoS());
    this->publisher = std::make_unique<realtime_tools::RealtimePublisher<diagnostic_msgs::msg::DiagnosticArray>>(publisher_);
    this->publisher->unlock();

    RCLCPP_INFO(this->get_node()->get_logger(), "configured");
    return CallbackReturn::SUCCESS;
}


CallbackReturn HardwareMonitor::on_activate(const rclcpp_lifecycle::State &previous_state) {
    RCL_UNUSED(previous_state);

    RCLCPP_DEBUG(this->get_node()->get_logger(), "activating");

    this->last_time = this->get_node()->get_clock()->now();

    RCLCPP_INFO(this->get_node()->get_logger(), "activated");

    return CallbackReturn::SUCCESS;
}


CallbackReturn HardwareMonitor::on_deactivate(const rclcpp_lifecycle::State &previous_state) {
    RCL_UNUSED(previous_state);

    RCLCPP_DEBUG(this->get_node()->get_logger(), "deactivating");


    RCLCPP_INFO(this->get_node()->get_logger(), "deactivated");

    return CallbackReturn::SUCCESS;
}


controller_interface::return_type HardwareMonitor::update() {
    RCLCPP_DEBUG(this->get_node()->get_logger(), "updating");

    if (this->flag_publish) {
        if(this->publisher->trylock()) {
            //clear the previous data
            this->publisher->msg_.status.clear();
            //foreach all state interfaces
            for(const auto &i:this->state_interfaces_) {
                auto diagnostic_status = diagnostic_msgs::msg::DiagnosticStatus();
                diagnostic_status.hardware_id = i.get_name();
                diagnostic_status.name = i.get_name();
                diagnostic_status.level = diagnostic_msgs::msg::DiagnosticStatus::OK;
                diagnostic_status.message = "ok";

                if (i.get_interface_name() == this->offline_interface_name && i.get_value() == 1) {
                    diagnostic_status.level = diagnostic_msgs::msg::DiagnosticStatus::ERROR;
                    diagnostic_status.message = "offline";
                    RCLCPP_DEBUG(this->get_node()->get_logger(), "[%s] offline", i.get_name().c_str());
                }
                if (i.get_interface_name() == this->temperature_interface_name && i.get_value() > this->overheat_threshold) {
                    diagnostic_status.level = diagnostic_msgs::msg::DiagnosticStatus::WARN;
                    diagnostic_status.message = "overheat " + std::to_string(i.get_value());
                    RCLCPP_DEBUG(this->get_node()->get_logger(), "[%s] overheat %f", i.get_name().c_str(), i.get_value());
                }

                bool found = false;
                for(auto& j : this->publisher->msg_.status) {
                    if (j.hardware_id == diagnostic_status.hardware_id) {
                        if (j.level == diagnostic_msgs::msg::DiagnosticStatus::OK) j = diagnostic_status;
                        if (j.level == diagnostic_msgs::msg::DiagnosticStatus::WARN &&
                        diagnostic_status.level == diagnostic_msgs::msg::DiagnosticStatus::ERROR) j = diagnostic_status;
                        found = true;
                    }
                }
                if (!found) this->publisher->msg_.status.emplace_back(diagnostic_status);
            }
            this->publisher->msg_.header.frame_id = "";
            this->publisher->msg_.header.stamp = this->get_node()->get_clock()->now();
            this->publisher->unlockAndPublish();
            this->flag_publish = false;
        }
    }

    //get current time
    auto time_now = this->get_node()->get_clock()->now();

    //control publish rate
    if (time_now - this->last_time < (1000ms / this->pub_rate)) {
        return controller_interface::return_type::OK;
    }

    this->flag_publish = true;
    this->last_time = time_now;
    return controller_interface::return_type::OK;
}


#include "pluginlib/class_list_macros.hpp"

PLUGINLIB_EXPORT_CLASS(gary_controller::HardwareMonitor, controller_interface::ControllerInterface)