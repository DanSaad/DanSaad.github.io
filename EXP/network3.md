---
layout: page
title: Network Architecture Diagram
subtitle: Lab Environment Topology
permalink: /network3/
hide_sidebar: true
mermaid: true
---

> **Note:** This diagram is published with the permission and approval of the client (Private Infrastructure). All sensitive details have been abstracted.

---

## Network Topology

<!--```mermaid -->
<div class="mermaid" markdown="0">
%%{init: {'theme': 'base', 'themeVariables': { 'fontSize': '20px', 'fontFamily': 'Inter'}}}%%
flowchart TD
    subgraph Public_Internet ["Public Internet"]
        subgraph Remote_Cloud [Remote Service Points]
            Droplet[Cloud Droplet]
            RemoteServer[Remote Server]
        end
    end

    subgraph Edge_Gateway [Edge / Perimeter]
        WANRouter[WAN Router]
    end

    subgraph DMZ_Zone [DMZ]
        DMZ_Server[Pub Facing Server]
        DMZ_Firewall[Firewall]
        subgraph Hypervisor3 [Hypervisor3]
            VMSVR1[Test Firewall 1]
            VMSVR2[Test Firewall 2]
        end
    end

    subgraph Internal_LAN [Internal LAN]
        LAN_Switch@{ shape: procs, label: "LAN Switch, WiFi AP" }
       
        subgraph Hypervisor1 [Hypervisor1]
            SVR1[PrivCloud]
            SVR2[FileServer]
        end
        subgraph Hypervisor2 [Hypervisor2]
            SVR3[Web,SVN]
            SVR4[SIEM,IDS]
        end
        SVR5[PBX]
        subgraph PersDev [Personal Devices]
            WS1@{ shape: procs, label: "Laptops (Windows, Macbook), Desktops (Windows, Linux)" }
            WS2@{ shape: procs, label: "Mobile (Phones, Tablets)" }
        end
        subgraph IoT [IoT]
            WS3@{ shape: procs, label: "IoT (Pi, ESP32/8266, etc.)" }
            WS4@{ shape: procs, label: "Smart TVs, Connected Appliances" }
            WS5@{ shape: procs, label: "IPCams" }
        end
    end

    %% Connections
    Public_Internet <==> Edge_Gateway

    %% Routing Logic
    WANRouter -.-> |Port Forward| DMZ_Server
    WANRouter --- DMZ_Firewall
    WANRouter --- Hypervisor3

    %% FORCED FLOW: Firewall -> Switch -> Devices
    DMZ_Firewall <==> LAN_Switch
   
    LAN_Switch <==> Hypervisor1
    LAN_Switch <==> Hypervisor2
    LAN_Switch <==> PersDev
    LAN_Switch <==> IoT
    LAN_Switch <==> SVR5

    %% VPN Flow
    Droplet <== "VPN Tunnel" ==> DMZ_Firewall
    RemoteServer <== "VPN Tunnel" ==> DMZ_Firewall

    %% Styling
    style DMZ_Server fill:#fff4dd,stroke:#d4a017,stroke-dasharray: 5 5
    style DMZ_Firewall fill:#f96,stroke:#333,stroke-width:3px
    style LAN_Switch fill:#ddd,stroke:#333,stroke-width:2px

    %% Hypervisor Styling (Teal)
    style Hypervisor1 fill:#90e4c1,stroke:#014d4e
    style Hypervisor2 fill:#90e4c1,stroke:#014d4e
    style Hypervisor3 fill:#90e4c1,stroke:#014d4e

    %% Server Styling (Blue)
    style SVR1 fill:#e1f5fe,stroke:#01579b
    style SVR2 fill:#e1f5fe,stroke:#01579b
    style SVR3 fill:#e1f5fe,stroke:#01579b
    style SVR4 fill:#e1f5fe,stroke:#01579b
    style SVR5 fill:#e1f5fe,stroke:#01579b

    %% Workstation Styling (Green)
    style WS1 fill:#e8f5e9,stroke:#2e7d32
    style WS2 fill:#e8f5e9,stroke:#2e7d32
    style WS3 fill:#e8f5e9,stroke:#2e7d32
    style WS4 fill:#e8f5e9,stroke:#2e7d32
    style WS5 fill:#e8f5e9,stroke:#2e7d32
</div>
<!-- ``` -->

---

## Zone Summary

| Zone | Components | Purpose |
|------|-----------|---------|
| **Public Internet** | Cloud Droplet, Remote Server | External access, VPN endpoints |
| **Edge / Perimeter** | WAN Router | Traffic ingress/egress, port forwarding |
| **DMZ** | Public Server, Firewall, Test Firewalls (Hypervisor3) | Public-facing services, firewall testing |
| **Internal LAN** | 2 Hypervisors (SVR1-4), PBX, Personal Devices, IoT | Core infrastructure, workstations, IoT |
