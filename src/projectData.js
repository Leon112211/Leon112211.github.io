export const categoryOrder = [
  'Robotics & Control',
  'Embedded & Energy Systems',
  'Sensing & Biomedical Research',
]

export const projects = [
  {
    slug: 'gangtou-special-steel-internship',
    featured: false,
    type: 'internship',
    date: '2024-07',
    dateLabel: 'Jul 2024',
    category: 'Industrial Automation',
    title: 'Engineering Internship at Gangtou Special Steel',
    shortTitle: 'Industrial engineering experience',
    summary: 'Observed industrial automation, production systems and engineering operations in practice at Gangtou Special Steel.',
    role: 'Engineering Intern',
    year: '2024',
    available: false,
    tech: [],
  },
  {
    slug: 'smartlink-industrial-io',
    featured: false,
    type: 'internship',
    date: '2026-01',
    endDate: '2026-02',
    dateLabel: '23 Jan – 28 Feb 2026',
    category: 'Industrial Automation',
    title: 'SmartLink Distributed Remote I/O',
    shortTitle: 'Industrial control integration',
    summary:
      'R&D testing and integration for next-generation distributed remote I/O modules across Siemens PROFINET and Beckhoff EtherCAT platforms.',
    role: 'R&D Test Engineer Intern',
    organization: 'Huatai Zhilian Technology (Nanjing) Co., Ltd.',
    year: '23 Jan – 28 Feb 2026',
    visual: 'industrial-io',
    cover: null,
    coverAlt: 'Industrial remote I/O network architecture',
    metrics: [
      { value: '2', label: 'automation ecosystems' },
      { value: 'PROFINET', label: 'Siemens data link' },
      { value: 'EtherCAT', label: 'Beckhoff fieldbus' },
    ],
    tech: ['S7-200 SMART', 'STEP 7-Micro/WIN SMART', 'TwinCAT 2/3', 'EtherCAT', 'PROFINET', 'ST / LAD', 'HMI'],
    problem:
      'A distributed remote I/O product must exchange control data reliably across different industrial automation ecosystems. Each platform brings its own topology, device description, process-data mapping and commissioning workflow, so interoperability has to be configured and tested at both controller and fieldbus level.',
    objective:
      'Integrate and validate SmartLink remote I/O modules with Siemens S7-200 SMART and Beckhoff CX5020 controllers, while documenting repeatable configuration and commissioning workflows for the engineering team.',
    architecture: [
      { label: 'PLC application', detail: 'ST / LAD control logic' },
      { label: 'Controller', detail: 'S7-200 SMART or CX5020' },
      { label: 'Industrial network', detail: 'PROFINET or EtherCAT' },
      { label: 'SmartLink I/O', detail: 'Distributed remote I/O nodes' },
      { label: 'HMI & validation', detail: 'Monitoring and commissioning' },
    ],
    contributions: [
      {
        title: 'Siemens system development',
        text: 'Configured S7-200 SMART hardware topologies and address allocation in STEP 7-Micro/WIN SMART V3, then implemented high-frequency PROFINET data exchange between the PLC and gateway.',
      },
      {
        title: 'Beckhoff platform integration',
        text: 'Built the EtherCAT node topology for a CX5020 controller and proprietary slave devices, including ESI configuration, PDO mapping and ST/LAD function logic in TwinCAT 2/3.',
      },
      {
        title: 'HMI and technical documentation',
        text: 'Designed multi-level HMI views for commissioning and monitoring, and produced structured technical documentation to support standardized workflows and knowledge transfer.',
      },
    ],
    implementation: [
      'Configured controller hardware, network topology and process-data addresses for the Siemens and Beckhoff test environments.',
      'Verified real-time PLC-to-gateway communication over PROFINET and controller-to-slave communication over EtherCAT.',
      'Created reusable ST/LAD logic and HMI views to make device state, mapping and commissioning behaviour observable.',
      'Consolidated the configuration process and test findings into engineering documentation for future deployments.',
    ],
    results: [
      'Completed cross-platform integration of SmartLink remote I/O with Siemens S7-200 SMART and Beckhoff CX5020 controllers.',
      'Established the required ESI configuration and PDO mapping for proprietary EtherCAT slave communication.',
      'Improved commissioning visibility through multi-level HMI monitoring and standardized technical documentation.',
    ],
    media: [{ type: 'diagram', visual: 'industrial-io', caption: 'Dual-platform SmartLink integration and validation path' }],
  },
  {
    slug: 'gmaster',
    featured: true,
    type: 'competition',
    date: '2023-12',
    endDate: '2024-04',
    dateLabel: 'Dec 2023 – Apr 2024',
    category: 'Robotics & Control',
    title: 'GMaster Robotics',
    shortTitle: 'Competition robotics control',
    summary:
      'Tuned the dual-loop (cascade) PID behind a RoboMaster robot\'s GM6020 gimbal — the control loop that decides how cleanly it aims.',
    role: 'Electrical Control Group Member & Robot Operator',
    year: 'Dec 2023 – Apr 2024',
    visual: 'robotics',
    cover: '/assets/robomaster.jpg',
    coverAlt: 'RoboMaster 2024 University League award certificate for XJTLU GMaster',
    metrics: [
      { value: 'GM6020', label: 'gimbal motor tuned' },
      { value: 'Dual-loop', label: 'cascade PID' },
      { value: '3rd', label: 'Shanghai station' },
    ],
    tech: ['ROS 2', 'C++', 'Cascade PID', 'CAN Bus', 'Ubuntu'],
    problem:
      'A competition gimbal has to snap onto a target, then hold it dead-still through chassis motion, vibration and fast-changing commands. Badly chosen gains show up at once — visible jitter and overshoot the moment it tries to settle.',
    objective:
      'Find the gain set that wins the speed-versus-stability trade-off — quick onto a new target, and steady once it settles.',
    architecture: [
      { label: 'Team ROS2 framework', detail: 'gary_controller / gary_gimbal (built by teammates)' },
      { label: 'Angle setpoint', detail: 'Fused from IMU orientation + motor encoder' },
      { label: 'Dual-loop PID', detail: 'Outer angle → inner angular-velocity (my tuning)' },
      { label: 'GM6020 over CAN', detail: 'Gimbal yaw / pitch actuation' },
    ],
    contributions: [
      {
        title: 'Dual-loop PID tuning',
        text: 'Set kp / ki / kd and the output limits on both loops — the inner angular-velocity loop and the outer angle loop.',
      },
      {
        title: 'On-robot validation',
        text: 'Confirmed the final tuning held up across team test runs and match prep.',
      },
      {
        title: 'Robot operator',
        text: 'Operated the robot in competition as an Electrical Control Group member — seeing the tuning perform under match conditions.',
      },
    ],
    implementation: [
      'Checked the command-and-feedback path end to end before changing a single gain.',
      'Tuned the gains live on the running robot, judging every change by the gimbal\'s real motion.',
    ],
    results: [
      'The gimbal tracked fast and settled steady on the real robot — the balance the tuning was after.',
      'Part of the Grade-A GMaster team — Third Prize, 2024 RoboMaster University League (Shanghai Station).',
    ],
    controllerIntegration: {
      eyebrow: 'Controller-level detail',
      title: 'The dual-loop gimbal control, up close',
      demoVideos: [
        {
          src: '/assets/robomaster-gimbal-demo.mp4',
          caption: 'Large-angle slewing — a fast swing onto a new target that slightly overshoots, then settles after a cycle or two of small oscillation.',
        },
        {
          src: '/assets/robomaster-gimbal-demo-2.mp4',
          caption: 'Small, rapid corrections — quick repeated adjustments while holding a target steady.',
        },
      ],
      description:
        'The control framework — gary_controller and gary_gimbal, an ros2_control-based stack — was built by my teammates; my hands-on part was tuning the GM6020 gimbal\'s dual-loop PID on top of it. Below: the competition certificate, the controller-level detail of that tuning, and what it taught me.',
      certificate: {
        src: '/assets/robomaster-certificate.jpg',
        alt: 'RoboMaster University League award certificate',
        caption: 'Third Prize · RoboMaster 2024 University League, Shanghai Station',
      },
      technicalDetails: [
        {
          label: 'Cascade control',
          code: 'outer angle → inner ω',
          text: 'The gimbal runs a dual-loop PID (a DualLoopPIDControllerWithFilter): an outer loop holds the commanded angle while an inner loop regulates angular velocity from the gyro. I tuned the gains of both stages.',
        },
        {
          label: 'PID gains',
          code: 'kp · ki · kd · max_iout · max_out · p/d filter',
          text: 'The knobs I adjusted on each loop: proportional, integral and derivative gains, the integral and output caps that act as anti-windup, and the first-order IIR filter coefficients that smooth the proportional and derivative terms.',
        },
        {
          label: 'Data path',
          code: 'IMU + encoder → setpoint → CAN',
          text: 'A gimbal node fuses IMU orientation and motor encoder into an angle setpoint, publishes it over a ROS2 topic, and the controller closes the loops and drives the GM6020 over CAN.',
        },
      ],
      codeStudy: {
        eyebrow: 'Inside the loops I tuned',
        title: 'How I tuned the two loops — and what fought back',
        caption:
          'Condensed from gary_controller\'s DualLoopPIDControllerWithFilter::update() — my teammates\' framework. The outer angle loop\'s output becomes the inner velocity loop\'s setpoint; I tuned the gains, filter coefficients and limits on both.',
        code: `// gary_controller · DualLoopPIDControllerWithFilter::update()   (teammates' framework — the loops I tuned)

// OUTER loop — hold the commanded ANGLE (fused IMU + encoder)
outer_err  = outer_set - outer_angle;
outer_iout = clamp(outer_iout + outer_ki*outer_err, ±outer_max_iout);          // integral, clamped (anti-windup)
outer_out  = clamp(outer_kp*outer_err + outer_iout
                 + outer_kd*(outer_err - outer_last_err), ±outer_max_out);

inner_set  = outer_out;                          // ← cascade link: outer output becomes inner target
inner_err  = inner_set - gyro_angular_velocity;  // INNER loop — track angular VELOCITY

// first-order IIR low-pass on the inner P and D terms — tames gyro noise / high-freq jitter
inner_pout = a_p*inner_pout + (1-a_p)*(inner_kp*inner_err);
inner_dout = a_d*inner_dout + (1-a_d)*(inner_kd*(inner_err - inner_last_err));
inner_iout = clamp(inner_iout + inner_ki*inner_err, ±inner_max_iout);
inner_out  = clamp(inner_pout + inner_iout + inner_dout, ±inner_max_out);

command_interfaces_[0].set_value(inner_out);     // → GM6020 over CAN  (zeroed if command stale > 0.1 s)`,
        approach:
          'Every gain, filter coefficient and limit is a live ROS2 parameter, so I tuned on the running robot with ros2 param set — no recompiling — and worked in the only order a cascade allows: the inner loop first, the outer loop second, reading the gimbal\'s real step response after every change.',
        tuningPath: [
          {
            step: '01',
            title: 'Inner angular-velocity loop first',
            text: 'In a cascade the inner loop has to be the fast one, so I tuned it before the outer loop came online. I raised inner_kp until the velocity response was crisp and just short of buzzing, added a little inner_ki to supply the steady command the motor needs to hold position, and kept inner_kd small — the rate signal is noisy, so I leaned on the loop\'s first-order IIR filter (the p/d filter coefficients) instead of raw derivative gain.',
          },
          {
            step: '02',
            title: 'Outer angle loop, deliberately slower',
            text: 'With a stiff inner loop, the outer loop sees a clean velocity-tracking actuator. I closed it at a clearly lower bandwidth — the textbook cascade rule that the outer loop must be several times slower than the inner one to stay stable. outer_kp sets how fast the gimbal slews onto a target, outer_kd damps the overshoot as it settles, a small outer_ki removes residual angle error, and outer_max_out caps the velocity command it hands down.',
          },
          {
            step: '03',
            title: 'Validate on the real gimbal, not a model',
            text: 'I judged every change by the gimbal\'s actual motion: a large-angle slew that swings on fast and settles after a small, quickly-damped overshoot, and small rapid corrections that track without buzzing. I also confirmed the controller\'s stale-command safety — it zeros the output if commands stop for more than 0.1 s — so an over-aggressive gain could never run the motor away while I experimented.',
          },
        ],
        challenges: [
          {
            situation: 'Pushing the inner-loop gain up for a snappy response left the gimbal buzzing around the target instead of holding it.',
            analysis: 'A high inner_kp plus derivative action on a noisy gyro signal drives the loop toward its stability margin, and the high-frequency content feeds back as a limit-cycle vibration.',
            solution: 'I backed inner_kp off, raised the IIR filter coefficient on the derivative and proportional terms to attenuate the high-frequency noise, and kept kd modest. The buzz disappeared at the cost of a slightly slower inner-loop response — one of the speed-versus-stability calls running through the whole tuning.',
          },
          {
            situation: 'On large slews the gimbal overshot the target angle and rang before settling.',
            analysis: 'The outer angle loop was too aggressive for the inner loop\'s bandwidth, so the cascade\'s "inner loop is much faster" assumption broke down and the two loops began to fight.',
            solution: 'I lowered outer_kp to keep the outer bandwidth well below the inner loop\'s and added outer_kd for damping. That pulled the big ringing down to a small overshoot that settles in a cycle or two — a touch I left in deliberately, since chasing zero overshoot would have made the slew sluggish.',
          },
          {
            situation: 'The pitch axis sagged under its own weight when asked to simply hold an angle.',
            analysis: 'The controller carries no gravity feed-forward, so proportional action alone leaves a steady-state droop — holding pitch needs a constant command that P cannot supply on its own.',
            solution: 'I let the integral term provide that steady command, but kept ki small and bounded max_iout so the integrator could not wind up during fast moves — the controller\'s only anti-windup is that clamp, so the discipline had to come from the gains.',
          },
        ],
      },
      note: 'What I took away: control is as much about communication as computation. Seeing IMU and encoder data fused into a setpoint, passed between ROS2 nodes, and closed through two nested loops before reaching the motor gave me a concrete feel for how distributed components have to agree on data and timing. Tuning by hand then taught me the real meaning of the stability–responsiveness tradeoff — how a few gains decide whether physical hardware holds steady or oscillates. That bridge from software and data to physical motion is a large part of why I want to study EECS.',
    },
    contextMedia: [
      {
        src: '/assets/robomaster-team-preparation.jpg',
        alt: 'GMaster team members preparing and debugging robots at RoboMaster 2024',
        caption: 'Team preparation and robot debugging',
      },
      {
        src: '/assets/robomaster-shanghai-arena.jpg',
        alt: 'RoboMaster 2024 University League competition arena in Shanghai',
        caption: 'University League competition venue',
      },
      {
        src: '/assets/robomaster-participant-pass.jpg',
        alt: 'RoboMaster 2024 University League participant credential',
        caption: 'Official participant credential',
      },
    ],
    contextMasonry: [
      {
        id: 'robomaster-arena-overview',
        img: '/assets/robomaster-gallery/robomaster-arena-overview.jpg',
        url: '/assets/robomaster-gallery/robomaster-arena-overview.jpg',
        height: 680,
        alt: 'RoboMaster 2024 University League competition arena in Shanghai',
      },
      {
        id: 'robomaster-operator-screen',
        img: '/assets/robomaster-gallery/robomaster-operator-screen.jpg',
        url: '/assets/robomaster-gallery/robomaster-operator-screen.jpg',
        height: 680,
        alt: 'Operator screen and match feed used during RoboMaster preparation',
      },
      {
        id: 'robomaster-robot-demo',
        img: '/assets/robomaster-gallery/robomaster-robot-demo.jpg',
        url: '/assets/robomaster-gallery/robomaster-robot-demo.jpg',
        height: 680,
        alt: 'GMaster robot platform shown in a demonstration environment',
      },
      {
        id: 'robomaster-team-debugging',
        img: '/assets/robomaster-gallery/robomaster-team-debugging.jpg',
        url: '/assets/robomaster-gallery/robomaster-team-debugging.jpg',
        height: 680,
        alt: 'Team-side robot preparation and debugging area at RoboMaster 2024',
      },
      {
        id: 'robomaster-standard-match',
        img: '/assets/robomaster-gallery/robomaster-standard-match.jpg',
        url: '/assets/robomaster-gallery/robomaster-standard-match.jpg',
        height: 600,
        alt: 'RoboMaster standard match field and competition sign',
      },
      {
        id: 'robomaster-shanghai-signature-wall',
        img: '/assets/robomaster-gallery/robomaster-shanghai-signature-wall.jpg',
        url: '/assets/robomaster-gallery/robomaster-shanghai-signature-wall.jpg',
        height: 600,
        alt: 'RoboMaster Shanghai station signature wall',
      },
      {
        id: 'robomaster-venue-floor',
        img: '/assets/robomaster-gallery/robomaster-venue-floor.jpg',
        url: '/assets/robomaster-gallery/robomaster-venue-floor.jpg',
        height: 600,
        alt: 'RoboMaster 2024 venue floor and team area',
      },
      {
        id: 'robomaster-participant-pass-closeup',
        img: '/assets/robomaster-gallery/robomaster-participant-pass-closeup.jpg',
        url: '/assets/robomaster-gallery/robomaster-participant-pass-closeup.jpg',
        height: 600,
        alt: 'RoboMaster 2024 University League participant pass',
      },
    ],
    media: [
      {
        type: 'bilibili',
        bvid: 'BV1tz421o7PJ',
        title: 'GMaster vs. Chang Kong Yu Feng',
        caption: 'RoboMaster 2024 University League · Shanghai · Match 01 · 06:43',
        url: 'https://www.bilibili.com/video/BV1tz421o7PJ/',
      },
      {
        type: 'bilibili',
        bvid: 'BV1fD421L7SM',
        title: 'GMaster vs. R&A Robotics',
        caption: 'RoboMaster 2024 University League · Shanghai · Match 36 · 08:14',
        url: 'https://www.bilibili.com/video/BV1fD421L7SM/',
      },
    ],
  },
  {
    slug: 'solar-pv',
    featured: false,
    type: 'course',
    date: '2026-04',
    endDate: '2026-05',
    dateLabel: 'Apr – May 2026',
    category: 'Embedded & Energy Systems',
    title: 'Intelligent Solar PV System',
    shortTitle: 'Self-tracking energy platform',
    summary:
      'An ESP32-S3 prototype combining solar tracking, automated cleaning, energy management and real-time visualization.',
    role: 'Team Leader',
    year: 'Apr – May 2026',
    visual: 'solar',
    cover: '/assets/solar-prototype.png',
    coverAlt: 'CAD model and physical prototype of the self-cleaning solar platform',
    metrics: [
      { value: '4', label: 'integrated modules' },
      { value: 'BLE', label: 'host connection' },
      { value: 'ESP32', label: 'system controller' },
    ],
    tech: ['ESP32-S3', 'BLE', '3D CAD', '3D Printing', 'MPPT', 'Blender', 'Power Sensing'],
    problem:
      'Small photovoltaic systems often treat tracking, cleaning, storage and monitoring as separate subsystems. That separation increases wiring, maintenance and control complexity while making overall system state difficult to observe.',
    objective:
      'Integrate the main operating and maintenance functions into one working prototype with a shared controller, unified data path and host-side visualization.',
    architecture: [
      { label: 'Light sensing', detail: 'Panel orientation inputs' },
      { label: 'ESP32-S3', detail: 'Tracking and cleaning control' },
      { label: 'Actuators', detail: 'Servos and roller-brush drive' },
      { label: 'Energy path', detail: 'MPPT, battery and power sensing' },
      { label: 'BLE host', detail: 'Live state and 3D visualization' },
    ],
    contributions: [
      {
        title: 'Mechanical system',
        text: 'Led mechanical structure design, material selection, 3D-printed part iteration and prototype assembly.',
      },
      {
        title: 'Embedded integration',
        text: 'Participated in ESP32-S3 control, servo tracking, power monitoring, battery-management and BLE integration.',
      },
      {
        title: 'Digital representation',
        text: 'Prepared Blender assets and coordinated the real-time visualization with physical panel and sensor state.',
      },
    ],
    implementation: [
      'Designed the roller-brush cleaning mechanism and iterated printed parts around travel, clearance and structural stability.',
      'Connected tracking, cleaning, battery and power-monitoring behaviours through the ESP32-S3 controller.',
      'Transmitted panel angle, light and power data to the host application over BLE for live visualization.',
    ],
    results: [
      'Produced an operating prototype that demonstrated automatic tracking and roller-brush cleaning.',
      'Validated battery-management and real-time voltage, current and power monitoring behaviours.',
      'Linked physical system state to a host-side 3D model and live sensor display.',
    ],
    media: [
      {
        type: 'video',
        src: '/assets/solar-system-demo.mp4',
        caption: 'Integrated prototype demonstration',
      },
      {
        type: 'image',
        src: '/assets/solar-prototype.png',
        alt: 'Mechanical CAD model and physical solar cleaning prototype',
        caption: 'Self-cleaning mechanism: CAD model and physical assembly',
      },
      {
        type: 'image',
        src: '/assets/solar-visualization.png',
        alt: 'Solar platform 3D model and real-time light sensor visualization',
        caption: 'Host-side 3D state and real-time light-sensor display',
      },
    ],
  },
  {
    slug: 'instrumentation-control-lab',
    featured: false,
    type: 'course',
    date: '2026-04',
    dateLabel: 'Apr 2026',
    category: 'Robotics & Control',
    title: 'Instrumentation and Control System',
    shortTitle: 'MATLAB / Simulink control lab',
    summary:
      'A two-person group lab from the Instrumentation and Control System course, modelled and simulated in MATLAB / Simulink.',
    role: 'Group lab (2 members)',
    year: 'Apr 2026',
    tech: ['MATLAB', 'Simulink'],
    problem:
      'TODO — describe the instrumentation / control problem this lab addressed (the system being measured or controlled, and why it matters).',
    objective:
      'TODO — what the MATLAB / Simulink modelling and simulation set out to achieve.',
    contributions: [
      {
        title: 'TODO — my role in the two-person group',
        text: 'TODO — describe what I personally did (e.g. modelling, controller design / tuning, simulation, analysis, report) vs. my partner.',
      },
    ],
    implementation: [
      'TODO — describe the MATLAB / Simulink work step by step: model build, controller design / tuning, simulation runs, analysis.',
    ],
    results: [
      'TODO — add outcomes: simulated / measured results, performance metrics, and conclusions.',
    ],
  },
  {
    slug: 'thin-film-chip-fabrication',
    featured: false,
    type: 'research',
    date: '2025-04',
    dateLabel: 'Apr 2025',
    category: 'Microfabrication & Devices',
    title: 'Optoelectronic Synaptic Transistor Fabrication',
    shortTitle: 'Neuromorphic device fabrication',
    summary:
      'Hands-on experience across the full fabrication-and-characterization workflow of solution-processed quantum-dot / metal-oxide optoelectronic synaptic transistors — bio-inspired devices for low-power artificial vision — during a guided session in a university research group, from substrate cleaning and surface activation through spin-coated multilayer films and shadow-mask electrode evaporation to electrical and optical device testing.',
    role: 'Hands-on fabrication & characterization',
    year: '2025',
    cover: '/assets/silicon-chip/chip-4.jpg',
    coverAlt: 'Close-up of fabricated chips showing fine patterned electrode arrays',
    metrics: [
      { value: 'QD–oxide', label: 'optoelectronic synapse' },
      { value: '7 steps', label: 'fabrication → testing' },
      { value: '≤300 °C', label: 'solution processing' },
    ],
    tech: ['Spin Coating', 'Thermal Evaporation', 'Metal-Oxide Semiconductors', 'Quantum Dots', 'Device Characterization', 'Shadow Mask', 'Plasma Treatment'],
    problem:
      'An optoelectronic synaptic transistor has to sense light and respond like a biological synapse on a single low-power device. Building one means stacking several solution-processed functional layers — a doped metal-oxide dielectric, a doped oxide channel and a quantum-dot light absorber — with clean interfaces and sharply patterned electrodes, because film uniformity and interface quality directly set how the finished transistor switches and how it responds to light.',
    objective:
      'Take a full set of these synaptic-transistor chips through the complete process chain — substrate preparation, plasma surface activation, precursor-solution preparation, spin-coating and annealing of each layer, shadow-mask alignment and thermal evaporation of the electrodes — and then characterize the finished devices electrically and optically.',
    architecture: [
      { label: 'Si substrate', detail: 'Cleaned silicon / thermal-oxide wafer' },
      { label: 'Dielectric', detail: 'Li⁺-doped Al₂O₃ / ZnO, spin-coated' },
      { label: 'Channel', detail: 'K⁺-doped In₂O₃ oxide semiconductor' },
      { label: 'Light absorber', detail: 'PbS / PbS–CdS quantum dots' },
      { label: 'Electrodes', detail: 'Shadow-mask thermal evaporation' },
    ],
    contributions: [
      {
        title: 'Full-chain fabrication (hands-on, guided)',
        text: 'Worked through every step alongside a senior student — wafer cleaning, plasma surface activation, weighing and stirring the precursor solutions, spin-coating and hot-plate annealing each layer, then shadow-mask attachment and thermal evaporation of the electrodes.',
      },
      {
        title: 'Process discipline',
        text: 'Followed the practical details that decide yield: chamber humidity for the plasma step, vacuum-suction centring before each spin-coat, hot-plate preheating, keeping the shadow mask clean and correctly oriented, and recording the per-batch recipe and date.',
      },
      {
        title: 'Device characterization exposure',
        text: 'Took part in electrical and optical testing of the finished devices on a semiconductor parameter analyser, seeing the transfer characteristics and light-driven synaptic response measured first-hand.',
      },
    ],
    implementation: [
      'Cleaned substrates through a solvent sequence (water → ethanol → isopropanol → water with ultrasonication, plus an HF / DI-water step for silicon), then plasma-activated the surface for uniform film wetting.',
      'Prepared the precursor solutions — Li-doped Al₂O₃ dielectric and K-doped In₂O₃ channel — by weighing the nitrate salts into deionised water and stirring at room temperature.',
      'Spin-coated and annealed each layer at its own recipe (dielectric ~400 / 4500 rpm then 300 °C; channel ~3000 rpm then 250 °C; quantum-dot layer at lower temperature), building the stack layer by layer.',
      'Aligned a cleaned shadow mask and ran the chips through shadow-mask thermal evaporation to deposit the patterned source/drain electrodes, then characterized the devices electrically and optically.',
    ],
    results: [
      'Helped take a full batch of patterned synaptic-transistor chips from bare substrate to working, electrically and optically characterized devices.',
      'Saw the fabricated devices behave as optoelectronic synapses — switching transfer characteristics and light-triggered post-synaptic-current responses — with very low static current as a key low-power feature of the group\'s design.',
      'Gained first-hand familiarity with solution-processed oxide / quantum-dot device fabrication and semiconductor characterization — the hands-on device experience I want to build on in an EECS programme.',
    ],
    media: [
      {
        type: 'image',
        src: '/assets/silicon-chip/device-performance.png',
        alt: 'Multi-panel device performance figure: transfer characteristics, a static-current benchmark, broadband spectral response and multi-level light response',
        caption:
          'Electrical and optical performance of this device platform (research-group study; the device type I helped fabricate): transfer characteristics with an on/off ratio of ~10⁵, a broadband 395–850 nm light response, and a benchmark highlighting the very low static current (~50 pA) behind its low standby power. Measurement and analysis are the group\'s.',
      },
      {
        type: 'image',
        src: '/assets/silicon-chip/synaptic-plasticity.png',
        alt: 'Multi-panel synaptic behaviour figure: post-synaptic currents under gate and light pulses, paired-pulse facilitation, and long-term potentiation and depression',
        caption:
          'Synaptic behaviour of the same device platform: post-synaptic currents triggered by gate and light pulses, paired-pulse facilitation, and light-driven potentiation / voltage-driven depression (LTP/LTD) — the optoelectronic-synapse response used for neuromorphic vision. From the group\'s study.',
      },
      {
        type: 'image',
        src: '/assets/silicon-chip/transfer-curve.jpg',
        alt: 'Semiconductor parameter analyser screen showing a transfer characteristic, drain current versus gate voltage on a log scale',
        caption: 'Transfer characteristics (drain current vs. gate voltage) of the finished devices, measured on a semiconductor parameter analyser.',
      },
      {
        type: 'image',
        src: '/assets/silicon-chip/chip-4.jpg',
        alt: 'Close-up of fabricated chips showing fine patterned electrode arrays',
        caption: 'Close-up of the patterned electrode arrays across the finished chips.',
      },
      {
        type: 'image',
        src: '/assets/silicon-chip/chip-2.jpg',
        alt: 'ZD-400 single-chamber four-source resistive thermal evaporation system control screen',
        caption: 'ZD-400 four-source resistive evaporation system — used for the shadow-mask electrode deposition.',
      },
      {
        type: 'image',
        src: '/assets/silicon-chip/chip-1.jpg',
        alt: 'A finished chip beside a recipe-labelled dish noting ZnO + Al₂O₃ + Li⁺, In₂O₃ + K⁺, dated 2025.4.13',
        caption: 'A completed device chip with its deposition recipe label — Li-doped ZnO / Al₂O₃ and K-doped In₂O₃, dated 13 Apr 2025.',
      },
    ],
  },
  {
    slug: 'force-sensor',
    featured: true,
    type: 'research',
    date: '2025-06',
    endDate: '2025-08',
    dateLabel: 'Jun – Aug 2025',
    category: 'Sensing & Biomedical Research',
    title: 'SURF: Real-time 3D Force Detection',
    shortTitle: 'Decoupled multi-axis sensing',
    summary:
      'A SURF research project on a Hall-effect tactile sensor: it reads three-axis force from a magnet-in-PDMS structure, and adds a TENG layer that identifies materials without contact.',
    role: 'XJTLU SURF Project Leader',
    year: 'Jun – Aug 2025',
    visual: 'force',
    cover: null,
    coverAlt: 'Technical diagram of the three-axis force sensing system',
    metrics: [
      { value: 'MLX90393', label: 'three-axis Hall sensing' },
      { value: 'H2 / H4 / H6', label: 'magnet-height variants' },
      { value: '13', label: 'TENG materials tested' },
    ],
    tech: ['EasyEDA Pro', 'Creo', 'I²C', 'Java', 'Processing', 'PDMS', 'Git'],
    problem:
      'Robotic tactile perception needs both force direction and contact-material information, but many tactile sensors either capture only one physical quantity or require complex structures and difficult signal decoupling.',
    objective:
      'Build and validate a dual-modal tactile sensing path: use a Hall sensor and magnet-displacement structure for three-dimensional force response, use a TENG layer for material-identification signals, and connect the force data to a real-time visualization pipeline.',
    architecture: [
      { label: 'Contact input', detail: 'Normal and tangential loading' },
      { label: 'PDMS + magnet', detail: 'Elastic displacement transduction' },
      { label: 'MLX90393 PCB', detail: 'Three-axis magnetic-field sensing' },
      { label: 'Calibration data', detail: 'Known force vs. Hall response' },
      { label: 'Visualization', detail: 'Real-time force-vector inspection' },
    ],
    contributions: [
      {
        title: 'Hall sensing hardware',
        text: 'Designed a compact two-layer Hall-sensing PCB around the MLX90393 chip and redesigned the device shape, layout and interface position for three-dimensional force detection.',
      },
      {
        title: 'PDMS-magnet packaging',
        text: 'Built a magnet-embedded PDMS pressing structure with epoxy resin packaging and compared different magnet placement heights for response optimization.',
      },
      {
        title: 'Testing and visualization',
        text: 'Constructed normal and tangential force test fixtures, collected Hall-output responses under known loads and connected the calibrated signals to real-time visualization software.',
      },
    ],
    implementation: [
      'Created a 41.8 mm × 15.4 mm two-layer PCB with a dedicated Hall-chip sensing area, signal-transmission section and external interface.',
      'Fabricated PDMS pressing layers using a 3D-printed mold, reserved magnet placement holes and completed a two-step PDMS sealing process.',
      'Used a digital force gauge and custom fixtures to apply repeatable normal and tangential forces while recording MLX90393 magnetic-field increments.',
      'Evaluated H2, H4 and H6 devices to study how magnet-chip distance affects tangential and normal-force sensitivity.',
    ],
    results: [
      'Verified that the Hall device produces force-dependent magnetic-field increments in all three directions.',
      'Observed higher tangential-force sensitivity from the H2 device, including approximately 587 μT/N in the x direction and 366 μT/N in the y direction.',
      'Confirmed that normal-force response is not simply maximized by the closest magnet distance; H4 showed the strongest average z-direction sensitivity.',
      'Demonstrated non-contact material-identification feasibility with TENG signals from 13 materials, including clear polarity/amplitude differences such as PU, FEP, PTFE and PDMS.',
    ],
    researchReport: {
      eyebrow: 'Technical validation',
      title: 'Dual-modal tactile sensing from device design to validation',
      description:
        'The full workflow — from sensor and PCB design through controlled force calibration to the contactless material-recognition tests. The hardware, fixtures and measured results are below.',
      stats: [
        { value: '41.8 × 15.4 mm', label: 'custom Hall PCB' },
        { value: '587 μT/N', label: 'best x-axis H2 sensitivity' },
        { value: '13 materials', label: 'TENG identification test' },
      ],
      stages: [
        {
          label: 'Hardware design',
          text: 'Redesigned the Hall sensing module around the MLX90393 chip, including PCB layout, sensing-area geometry and an interface layout that reduces mechanical disturbance.',
        },
        {
          label: 'Device fabrication',
          text: 'Fabricated a PDMS-epoxy composite structure with a reserved magnet position, using mold-assisted PDMS filling, degassing and two-step curing.',
        },
        {
          label: 'Force calibration',
          text: 'Built normal-force and tangential-force fixtures, then recorded magnetic-field increments under known external loads to form force-response evidence.',
        },
        {
          label: 'Non-contact material recognition',
          text: 'Used a single-electrode TENG setup to identify nearby materials from voltage amplitude and polarity differences, separating samples such as PU, FEP, PTFE and PDMS without relying on direct tactile force sensing.',
        },
      ],
      figures: [
        {
          src: '/assets/force-fyp/hall-schematic.png',
          alt: 'MLX90393 Hall sensing schematic PCB layout and 3D render',
          caption: 'MLX90393 Hall sensing module schematic, PCB layout and 3D hardware render.',
          images: [
            {
              src: '/assets/force-fyp/hall-schematic.png',
              alt: 'MLX90393 Hall sensing module schematic',
              label: 'Schematic',
            },
            {
              src: '/assets/force-fyp/hall-layout.png',
              alt: 'MLX90393 Hall sensing PCB layout',
              label: 'PCB layout',
            },
            {
              src: '/assets/force-fyp/hall-3d-render.png',
              alt: 'MLX90393 Hall sensing PCB 3D render',
              label: '3D render',
            },
          ],
        },
      ],
      note:
        'The two sensing paths were built and tested separately here; the natural next step is integrating them into a single array with richer feature extraction.',
    },
    processFlow: {
      eyebrow: 'Full process',
      title: 'From bare PCB to real-time 3D force',
      description:
        'The end-to-end build — from the Hall-sensor board through molding, encapsulation and calibration to live force visualization. Images and code for each step follow.',
      steps: [
        {
          num: '01',
          phase: 'Build & encapsulate',
          title: 'PCB fabrication & soldering',
          text: 'Custom MLX90393 Hall-sensor board fabricated, then hand-soldered.',
          tags: [{ label: 'read over I²C' }],
          images: [
            {
              src: '/assets/force-fyp/initial-pcb-layout.jpg',
              alt: 'Initial Hall sensing PCB layout with dimensions',
              label: 'Initial PCB layout',
            },
            {
              src: '/assets/force-fyp/initial-3d-front.jpg',
              alt: 'Initial Hall sensing module 3D front view',
              label: 'Early 3D view A',
            },
            {
              src: '/assets/force-fyp/initial-3d-back.jpg',
              alt: 'Initial Hall sensing module 3D back view',
              label: 'Early 3D view B',
            },
          ],
          caption:
            'Initial Hall-sensing module version: an early compact PCB geometry with an angled connector and preliminary 3D structural views, before the later schematic, board layout and render refinement shown above.',
        },
        {
          num: '02',
          title: '3D-printed molds',
          text: 'TPU and PLA mold tooling printed for the encapsulation step.',
          tags: [
            { label: 'TPU 85A shore', key: true },
            { label: 'print infill density tunes TPU stiffness for clean release' },
          ],
        },
        {
          num: '03',
          title: 'Epoxy-resin potting',
          text: 'The sensing region of the PCB is potted in epoxy resin; the board\'s four vias are used to route signal through both faces.',
          tags: [
            { label: '4 vias ↔ both faces' },
            { label: 'controlled trials → 60 °C · 1 h demold', key: true },
          ],
          image: {
            src: '/assets/force-fyp/potted-device.jpg',
            alt: 'Demolded epoxy-potted Hall-sensor device with flexible PCB tail and 4-pin connector',
            caption: 'The demolded device after the 60 °C · 1 h cure — the sensing region potted and released, with the flexible PCB tail and 4-pin connector intact.',
          },
        },
        {
          num: '04',
          title: 'PDMS casting & magnet embedding',
          text: 'A soft PDMS layer is cast over the sensing region with a small magnet embedded above the Hall chip. Under load the PDMS deforms and displaces the magnet relative to the chip — the relative motion the sensor reads out as a field change.',
          tags: [
            { label: 'soft PDMS layer' },
            { label: 'embedded magnet ↔ Hall chip', key: true },
          ],
          images: [
            {
              src: '/assets/force-fyp/pdms-casting.jpg',
              alt: 'PDMS-cast Hall sensing device in a petri dish, top view',
              label: 'PDMS casting',
            },
            {
              src: '/assets/force-fyp/pdms-magnet.jpg',
              alt: 'Angled view of the cast device showing the magnet embedded in the PDMS layer',
              label: 'Embedded magnet',
            },
          ],
          caption: 'PDMS cast over the sensing region with a magnet embedded on top; applied force deforms the PDMS and moves the magnet relative to the Hall sensor.',
          image: {
            src: '/assets/force-fyp/final-hall-device.jpg',
            alt: 'Final Hall sensing device after epoxy potting and PDMS packaging',
            caption: 'The finished device after epoxy-resin potting and PDMS packaging.',
          },
        },
        {
          num: '05',
          phase: 'Characterize & output',
          title: 'Force-response measurement',
          text: 'Each device is loaded in 0.5 N steps — 0–3 N on the tangential x / y axes and 0–20 N on the normal z axis — and the raw Hall frames at every step are averaged into a clean ΔB per force level, for the H2, H4 and H6 builds.',
          tags: [
            { label: '0.5 N steps · 0–3 N (x,y) / 0–20 N (z)', key: true },
            { label: 'raw frames averaged per step' },
            { label: 'H2 · H4 · H6' },
          ],
          imageLayout: 'triptych',
          images: [
            {
              src: '/assets/force-fyp/force-x-axis.png',
              alt: 'X-axis tangential force test: Hall-field increment versus applied force for H2, H4 and H6',
            },
            {
              src: '/assets/force-fyp/force-y-axis.png',
              alt: 'Y-axis tangential force test: Hall-field increment versus applied force for H2, H4 and H6',
            },
            {
              src: '/assets/force-fyp/force-z-axis.png',
              alt: 'Z-axis normal force test: Hall-field increment versus applied force for H2, H4 and H6',
            },
          ],
          caption: 'Figure 2.18 — measured Hall response (ΔB) under (A) x-axis and (B) y-axis tangential loading and (C) z-axis normal loading, for the H2, H4 and H6 variants.',
        },
        {
          num: '06',
          title: 'Per-device calibration',
          text: 'For each applied axis an ordinary least-squares line is fit to every Hall reading versus force — the main (diagonal) sensitivity plus the two cross-axis coupling terms. The nine slopes form the full 3×3 sensitivity matrix S, so axis coupling is captured rather than assumed away.',
          equation: 'ΔB = S · F',
          tags: [
            { label: 'ordinary least squares (np.linalg.lstsq)' },
            { label: 'main + cross-axis coupling', key: true },
            { label: '3×3 S per H2 / H4 / H6 (µT/N)' },
          ],
          imageWide: true,
          image: {
            src: '/assets/force-fyp/force-testing-fixture.jpg',
            alt: 'Normal-force and tangential-force calibration fixtures',
            caption: 'Controlled fixtures for normal-force and tangential-force calibration — each device is loaded here to record the response that the fit above uses.',
          },
          code: `def least_squares_slope(forces, readings):     # one of the 9 entries of S
    A = np.column_stack([forces, np.ones_like(forces)])
    return np.linalg.lstsq(A, readings, rcond=None)[0][0]   # slope, uT/N`,
        },
        {
          num: '07',
          title: 'Decoupling',
          text: 'At startup a 100-frame static baseline B₀ is averaged and removed; every live frame becomes ΔB = B − B₀. The decoupling matrix D = S⁻¹ (N/µT) maps it back to force as F = D · ΔB. Fx and Fy keep their sign, Fz is treated as compression-only and clamped at zero, and a singular matrix is guarded against.',
          equation: 'F = D · ΔB,  D = S⁻¹',
          tags: [
            { label: 'baseline B₀ = 100 frames', key: true },
            { label: 'D = S⁻¹ (N/µT)' },
            { label: 'Fz clamped ≥ 0' },
          ],
          code: `// dV = B - baseline (the dB field increment, uT);  D = S^-1 (N/uT)
void computeForce(float dVx, float dVy, float dVz) {
  float[][] D = D_ALL[activeSensor];
  forceX = D[0][0]*dVx + D[0][1]*dVy + D[0][2]*dVz;          // X keeps sign
  forceY = D[1][0]*dVx + D[1][1]*dVy + D[1][2]*dVz;          // Y keeps sign
  forceZ = max(0, D[2][0]*dVx + D[2][1]*dVy + D[2][2]*dVz);  // Z: compression-only
}`,
        },
        {
          num: '08',
          title: 'Real-time visualization',
          text: 'A Processing 4.x dashboard reads the MLX90393 stream at 115200 baud, runs the baseline-and-decouple loop each frame, and drives six live panels — a rotatable 3D force vector, Fx / Fy / Fz / |F| bars, a Z-axis pressure pad, an XY tangential compass, scrolling ΔB waveforms and the live S / D matrix — switchable across H2 / H4 / H6 with FPS and bad-frame health.',
          tags: [
            { label: 'Processing 4.x · 115200 baud' },
            { label: '6 live panels', key: true },
            { label: 'H2 / H4 / H6 switchable' },
          ],
        },
        {
          num: '09',
          phase: 'Second sensing path',
          title: 'TENG material recognition',
          text: 'A single-electrode triboelectric (TENG) channel identifies nearby materials from the amplitude and polarity of the contact-separation voltage — a non-contact path that complements the Hall force sensing.',
          tags: [
            { label: 'single-electrode TENG' },
            { label: '13 materials identified', key: true },
          ],
          image: {
            src: '/assets/force-fyp/teng-material-results.png',
            alt: 'TENG output voltage versus time for thirteen materials used for non-contact material identification',
            caption: 'Figure 2.19 — TENG output for material identification: each material gives a distinct voltage amplitude and polarity, enabling non-contact recognition.',
          },
        },
      ],
    },
    projectExperience: {
      eyebrow: 'Independent project evidence',
      title: 'A complete force-sensing visualization pipeline',
      description:
        'This is my own authored software work for the SURF 3D-force project, complementing the hardware, sensor structure and calibration work described in the timeline.',
      repository: 'https://github.com/Leon112211/Three_Dimension_Force_Visualization',
      repositoryFrontLabel: 'Leon112211/Three_Dimension_Force_Visualization',
      repositoryLabel: 'GitHub / Three_Dimension_Force_Visualization',
      showRepositoryLink: false,
      highlights: [
        'Built the measurement loop around the tested hardware process: bring the probe into the initial contact position, zero the force gauge, load the device in normal and tangential directions, and record stable Bx / By / Bz readings at known force levels.',
        'Converted raw Hall readings into magnetic-field increments using the calibration definition deltaB = B_F - B_0, then used direction-specific response curves and S_avg = deltaB_max / F_max to estimate force sensitivity in uT/N.',
        'Implemented the software-side reconstruction path by subtracting a live baseline, forming the deltaB vector, applying a calibrated sensitivity / decoupling matrix, and reconstructing Fx / Fy / Fz for real-time visualization.',
      ],
      modules: [
        {
          label: 'Acquisition loop',
          text: 'Arduino serial data is parsed as three-axis magnetic-field samples, matching the tested workflow of observing Bx, By and Bz while the force gauge applies controlled loads.',
        },
        {
          label: 'Baseline removal',
          text: 'A 100-frame baseline represents the no-load magnetic state B0; each incoming frame is converted to deltaB so static offsets and installation bias are removed before force estimation.',
        },
        {
          label: 'Sensitivity model',
          text: 'Calibration curves map known force inputs to magnetic-field increments. The average sensitivity uses S_avg = deltaB_max / F_max, while the software keeps a matrix form for coupled three-axis reconstruction.',
        },
        {
          label: 'Force reconstruction',
          text: 'The live estimate follows F = S^-1 * deltaB: invert or load the calibrated sensitivity matrix, recover Fx/Fy/Fz, then display magnitude, direction, pressure surface and live signal history.',
        },
      ],
      note:
        '',
    },
    media: [
      {
        type: 'image',
        src: '/assets/force-fyp/force-dashboard.png',
        alt: 'Real-time 3D force visualization dashboard showing decoupled Fx/Fy/Fz, a 3D force vector, force-component bars, a Z-axis pressure map, XY tangential force and magnetic-delta waveforms',
        caption: 'Real-time visualization dashboard: live decoupled 3D force (Fx/Fy/Fz), force vector, Z-axis pressure map and magnetic-delta waveforms.',
      },
    ],
  },
  {
    slug: 'cardiopulmonary-sensor',
    featured: false,
    type: 'research',
    date: '2025-10',
    category: 'Sensing & Biomedical Research',
    title: 'Flexible Cardiopulmonary Sensor',
    shortTitle: 'Low-power physiological sensing',
    summary:
      'A flexible magnetic sensing and DSP pipeline for separating heartbeat and respiratory signals in real time.',
    role: 'Research Project Member',
    year: 'Oct 2025',
    visual: 'biosignal',
    cover: null,
    coverAlt: 'Technical visualization of heartbeat and respiratory signal extraction',
    metrics: [
      { value: '±2 BPM', label: 'heart-rate precision' },
      { value: '0.15 W', label: 'power consumption' },
      { value: 'BLE', label: 'wireless data link' },
    ],
    tech: ['ESP32-C3-Mini', 'BLE', 'Python', 'DSP', 'HPF / LPF', 'Peak Detection'],
    problem:
      'A wearable magnetic sensor captures slow respiratory motion and much smaller heartbeat components in the same raw signal. The useful cardiac waveform must be isolated without losing the respiratory trend or creating a heavy processing and power burden.',
    objective:
      'Build a low-latency wireless acquisition and Python processing pipeline that separates, displays and validates both cardiopulmonary components.',
    architecture: [
      { label: 'Flexible sensor', detail: 'Magnetic deformation signal' },
      { label: 'ESP32-C3', detail: 'Low-power acquisition' },
      { label: 'BLE link', detail: 'Wireless sample transport' },
      { label: 'Python DSP', detail: 'HPF / LPF separation' },
      { label: 'Live output', detail: 'Heart and respiration traces' },
    ],
    contributions: [
      {
        title: 'Wireless acquisition',
        text: 'Established a low-latency BLE data link through the ESP32-C3-Mini and a Python host application.',
      },
      {
        title: 'Signal separation',
        text: 'Implemented digital high-pass and low-pass filtering to separate the subtle heartbeat component from respiration.',
      },
      {
        title: 'Live validation',
        text: 'Visualized incoming physiological signals and evaluated heart-rate precision and system power demand.',
      },
    ],
    implementation: [
      'Acquired the flexible sensor output through the ESP32-C3-Mini and transported samples wirelessly over BLE.',
      'Applied frequency-selective filtering and peak detection in Python to form independent cardiac and respiratory traces.',
      'Displayed the processed output live so behaviour could be compared during validation.',
    ],
    results: [
      'Isolated heartbeat information from the larger respiratory component in the measured signal.',
      'Validated heart-rate precision to within 2 BPM.',
      'Operated the sensing and communication system at approximately 0.15 W.',
    ],
    media: [{ type: 'diagram', visual: 'biosignal', caption: 'Wireless cardiopulmonary signal-processing path' }],
  },
  {
    slug: 'surf-2026',
    featured: false,
    type: 'research',
    date: '2026-06',
    endDate: '2026-08',
    dateLabel: 'Jun – Aug 2026',
    category: 'XJTLU Summer Undergraduate Research Fellowship',
    title: 'SURF 2026 Research Project',
    shortTitle: 'Upcoming undergraduate research',
    summary: 'A three-month on-campus summer research project at XJTLU. The research topic is currently to be confirmed.',
    role: 'Circuit Team Leader',
    year: 'Jun – Aug 2026',
    status: 'Planned',
    available: false,
    detailNote: 'Research topic to be confirmed',
    tech: [],
  },
]

export function getProject(slug) {
  return projects.find((project) => project.slug === slug && project.available !== false)
}

export function getAdjacentProjects(slug) {
  const publishedProjects = projects.filter((project) => project.available !== false)
  const index = publishedProjects.findIndex((project) => project.slug === slug)
  if (index === -1) return { previous: null, next: null }

  return {
    previous: publishedProjects[(index - 1 + publishedProjects.length) % publishedProjects.length],
    next: publishedProjects[(index + 1) % publishedProjects.length],
  }
}
