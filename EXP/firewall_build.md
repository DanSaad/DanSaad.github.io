---
layout: page
title: Building Firewalls
subtitle: Hands-on XCP-ng and Firewall Installation
permalink: /firewall-build/
mermaid: false
---


Client needed a setup for testing and comparing opnSense and pfSense. I started by installing the XCP-ng server to support both firewalls as VMs on the hypervisor.

## Hardware Overview
I used a **Mini Computer** as the hypervisor hardware, with the following specifications:
- **CPU:** i5 - 43004, 1.6 GHz
- **Cores:** 2
- **Memory:** 8 GB
- **sda:** 119 GB [ATA Starsway MSATA1]
- **sdb:** 931 GB [ATA HGST HTS721010A9]

## Boot and Installation Process
I began with the **Boot/BIOS** setup and proceeded with a clean installation of **XCP‑ng**.

### Disk Configuration
I used sda for dom0 (host) install and sdb for the VMs.

I utilized **LVM (Thick Provisioning)** for the setup. To initiate the process, I installed the software from USB media.

### Network Connectivity
Next, I set up the physical connections for the four network interfaces:
- **eth0:** WAN
- **eth1:** LAN (IPv4) - Configured as a server with a static IP address.
- **eth2:** [TBD, intended for IoT]
- **eth3:** [TBD, intended for Security cameras ]

To configure the static network, I established the following:
- Address and Subnet Mask
- Gateway (the existing LAN-side Firewall Address)
- Hostname Configuration
    - DNS Configuration:
      - **server1** matches the gateway
      - **server2** is set to Google (8.8.8.8)

Once the configuration was complete, I finished the installation and removed the USB media.

### Boot Sequence and Verification
Upon booting **XCP‑ng**, I checked the BIOS and observed the system attempting to open the **TPM (Trusted Platform Module chip)**. I confirmed that `eth1` was connected and, although the system initially booted in safe mode, it successfully rebooted into normal mode. The total load time was approximately 2 minutes, and I moved onto a fresh network assignment.

## Network Discovery and Scanning
I needed to understand the types of addresses on the network:
- **DHCP:** Dynamic addresses; I can check with the server to see if the addresses have been issued.
- **Static IP Addresses:** These cannot be searched via the DHCP server as they are configured per-machine. If the person who configured the machine added the address to DNS, I could find it there; otherwise, I would have to use **NMAP**.

I noted that `ping` doesn't always work for finding static IP addresses because not everything responds to ICMP, but **NMAP** can perform port scanning. I also utilized **ARP** to check who has a specific IP, which returns the MAC address if the IP is taken.

I ran all three scans to get a complete picture of what was available on the network:
- First, I used **ping** to identify two free addresses in the desired range.
- `arp -a` returned the MAC Address of one of the addresses I chose.
- After confirming the desired address wasn't in use, I conducted an nmap scan for completeness, which also revealed the ports of various communication protocols on the network.

## XCP‑ng Center and Virtualization
I used **XCP‑ng Center** to set up the new firewall without breaking the old one. I downloaded v25 in parallel with v20 so that existing communication with old servers wouldn't break (v25 doesn't connect to the older servers), then configured the new firewall.

I configured the Virtual Network Interfaces on the Firewall VM, using a UFS installation.

### Interface Assignment
I assigned the interfaces for both firewalls using the mappings
- **WAN** to eth0
- **LAN** to eth1
- **Interface 2**: eth2
- **Interface 3**: eth3

I then set up the System Configuration to have the Firewall sit on **2** and communicate with the ISP on **3**.

### Final System Configuration
With the new firewalls installed, the system was turned over to the client for comparison and evaluation.
