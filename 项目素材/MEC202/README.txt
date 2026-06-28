# 自追踪自清洁智能太阳能光伏能源管理系统

## Project Title
Self-Tracking and Self-Cleaning Intelligent Solar PV Energy Management System

## 项目简介
本项目面向小型光伏设备的自动化运维，设计并搭建了一套集成式太阳能光伏管理原型系统。系统以 ESP32-S3 单片机作为主控，通过 BLE 蓝牙与上位机通信，并集成太阳追踪、滚刷式自清洁、电池充放电与功率检测、Blender 三维模型驱动的上位机实时可视化四个核心模块，目标是在提高太阳能接收效率的同时，减少灰尘积累造成的输出损失，降低人工维护需求，并让用户能够实时观察系统运行状态。

该原型通过多轮结构设计、3D 打印、机械装配、控制联调和功能测试完成验证，能够基本实现自动追踪、自清洁、功率检测、电池管理和运行状态展示。

## Overview
This project developed an integrated prototype for automated operation and maintenance of small photovoltaic systems. The system uses an ESP32-S3 microcontroller as the main controller and communicates with the upper-computer host through Bluetooth Low Energy (BLE). It combines four core modules: solar tracking, motor-driven roller-brush self-cleaning, battery charging/discharging with power monitoring, and host-side real-time visualization driven by Blender-based 3D model assets.

The goal is to improve solar energy reception, reduce output loss caused by dust accumulation, lower manual maintenance requirements, and allow users to monitor the system status in real time.

## 核心功能 / Key Features
- Solar Tracking Module：基于光照传感器和伺服机构调整太阳能板角度，使面板尽量保持接近最佳受光方向。
- Self-Cleaning Module：使用电机驱动滚刷机构清理太阳能板表面灰尘，减少人工清洁需求。
- Battery & Power Management Module：集成 MPPT、电池充放电管理，以及实时电压、电流和功率检测。
- Real-Time Visualization Module：ESP32-S3 通过 BLE 蓝牙向上位机发送面板角度、光照传感器、功率输出和系统状态数据；上位机使用 Blender 整理和导出的三维模型资产进行实时姿态与状态可视化。

## 我的贡献 / My Contributions
我主导了系统级技术实现，重点负责机械结构设计、自清洁滚刷机构、材料选择、3D 打印结构件迭代和原型装配，并深度参与 ESP32-S3 控制逻辑、BLE 蓝牙上位机通信、伺服追踪、功率监测、电池管理、Blender 三维模型资产处理和实时可视化界面的联调验证。

My main contribution was leading the system-level technical implementation. I focused on mechanical structure design, the roller-brush self-cleaning mechanism, material selection, iterative fabrication of 3D-printed parts, and prototype assembly. I also deeply participated in the integration and debugging of ESP32-S3 control logic, BLE communication with the upper-computer host, servo tracking, power monitoring, battery management, Blender-based 3D model asset preparation, and real-time visualization.

## 技术实现 / Technical Implementation
- 机械结构：设计清洁模块、支撑臂、背板和主体装配关系，检查滚刷高度、运动间隙和结构稳定性。
- 原型制造：使用 CAD 建模并通过 3D 打印迭代结构件，处理喷嘴堵塞、PLA/PETG 支撑材料粘结、首层翘曲等制造问题。
- 单片机与通信：以 ESP32-S3 作为主控，采集追踪角度、传感器和功率相关数据，并通过 BLE 蓝牙与上位机通信，为三维可视化和状态监测提供实时数据。
- Blender 可视化：整理太阳能板、支撑结构和清洁机构的三维模型，进行模型轻量化、坐标/姿态校准和可视化资产导出，使网页端能够展示系统结构和面板姿态变化。
- 控制与联调：验证伺服追踪响应、清洁机构运动、MPPT/电池管理状态、功率监测数据，并将 ESP32-S3 通过 BLE 发送的实时角度、传感器和功率数据与上位机三维可视化界面联动。
- 系统集成：将太阳追踪、自清洁、电池/功率管理和可视化功能整合为一个可运行原型。

## 测试与结果 / Testing & Results
项目通过追踪响应测试、自清洁效果测试、电池管理功能测试和实时可视化测试验证了原型系统的可行性。测试结果表明，系统能够基本实现自动追踪、自动清洁、功率检测、能量管理和数据展示等核心功能。

The prototype was verified through tracking response tests, self-cleaning tests, battery management tests, and real-time visualization tests. The results showed that the system could basically achieve the expected functions of automatic tracking, automatic cleaning, power detection, energy management, and data display.

## 局限与改进 / Limitations & Future Work
当前原型仍受机械精度、结构稳定性和系统规模限制。后续可进一步优化追踪精度、清洁机构稳定性、布线与 PCB 集成、外壳保护，以及可视化界面的提示和历史数据记录功能。
