#pragma once

#include "rclcpp/rclcpp.hpp"
#include "controller_interface/controller_interface.hpp"
#include "gary_msgs/srv/reset_motor_position.hpp"
#include <chrono>


using CallbackReturn = rclcpp_lifecycle::node_interfaces::LifecycleNodeInterface::CallbackReturn;
using namespace std::chrono;


namespace gary_controller {

class CalibrationController : public controller_interface::ControllerInterface {

public:

    controller_interface::return_type init(const std::string &controller_name) override;


    controller_interface::InterfaceConfiguration command_interface_configuration() const override;


    controller_interface::InterfaceConfiguration state_interface_configuration() const override;


    CallbackReturn on_configure(const rclcpp_lifecycle::State &previous_state) override;


    CallbackReturn on_activate(const rclcpp_lifecycle::State &previous_state) override;


    CallbackReturn on_deactivate(const rclcpp_lifecycle::State &previous_state) override;


    controller_interface::return_type update() override;

    void service_callback(std::shared_ptr<gary_msgs::srv::ResetMotorPosition::Request> request,
                          std::shared_ptr<gary_msgs::srv::ResetMotorPosition::Response> response);

private:
    //params
    std::string interface_name;
    std::vector<std::string> motor_names;

    //service server
    rclcpp::Service<gary_msgs::srv::ResetMotorPosition>::SharedPtr service;

};
}