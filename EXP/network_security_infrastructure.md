# Security Infrastructure & Virtualization

I built a dedicated lab environment on bare metal to test and compare security tools without affecting any production systems. The hardware I used was an Intel-based system (Xeon processor, 64GB RAM, and a mix of NVMe and HDD storage) that I installed XCP-ng 8.3 on directly.

First, I downloaded the XCP-ng ISO and created a bootable USB drive. I booted from the USB and followed the installer prompts, assigning a static IP address on my Internal LAN (192.168.1.10/24 per network3.md) for management. After installation, I locked down dom0 by disabling password SSH and setting up key-only authentication, then installed the XCP-ng SSL certificate for the XAPI.

With the hypervisor running, I created three virtual networks to match the zones in my network3.md diagram:
- eth0 → Internal LAN (for management and VM traffic)
- eth1 → DMZ Zone
- eth2 → IoT VLAN (no Internet access)

Next, I prepared cloud-init templates for common OS images so I could quickly spin up VMs. I made templates for Ubuntu 24.04, Windows 11 evaluation, OPNsense, pfSense, and Kali Linux. Each template was set to auto-expand the disk, inject my SSH key, assign a static IP based on the VLAN, and run a full update on first boot.

I then deployed two firewall VMs side by side for comparison: one running OPNsense 24.7 and one running pfSense 2.7.2. Each got 2 vCPU, 2GB RAM, and a 20GB disk, with three network interfaces connected to eth0 (LAN), eth1 (WAN/DMZ), and eth2 (OPT1/IoT). I configured both with the same basic setup: a WAN connection to a simulated Internet feed, LAN on the Internal LAN, and OPT1 pointing to the IoT VLAN.

To compare them fairly, I enabled the same features on both:
- Suricata IPS in inline mode
- WireGuard VPN server
- DHCP server on the LAN interface
- Basic firewall rules allowing LAN to WAN and blocking WAN to LAN by default

I spent a week sending test traffic through each firewall (using nmap, hping3, and simple HTTP/HTTPS requests from a client VM) and noted differences in the user interface, rule creation, VPN setup, and built-in reporting. I found that OPNsense had a more modern API (making automation easier), native Suricata integration, and a cleaner WireGuard setup, while pfSense had a larger library of community packages but a slightly older-feeling UI. For my lab, I chose OPNsense as the primary DMZ firewall because I valued the API-first approach and native IDS/IPS integration.

Alongside the firewall testing, I deployed an Ubuntu server VM (4 vCPU, 8GB RAM, 50GB disk) to act as the host for my security stack. I installed the Wazuh single-node package (which bundles the manager, indexer, and dashboard) and Suricata from the Ubuntu repositories. I configured Suricata to run in AF_PACKET mode on a SPAN port that mirrors the traffic passing through the OPNsense firewall’s LAN interface—this way I could see both sides of the traffic without putting Suricata inline and risking a bottleneck.

I verified the stack was working by generating some test traffic from a Kali VM (running nmap scans and Metasploit exploits) and confirming that:
- Suricata triggered alerts and wrote them to eve.json
- Wazuh ingested the eve.json file via a localfile input
- Alerts appeared in the Wazuh dashboard with proper decoding and MITRE ATT&CK tags when I added custom rules
- File integrity monitoring and vulnerability detection from the Wazuh agent on the Ubuntu VM itself were functioning

This virtualized environment gave me a safe place to stress-test the security stack, try out detection rules, and practice incident response playbooks without any risk to my actual network or data. It also provided a verified deployment model that I could later document and reuse if needed.

---
*Tools: XCP-ng 8.3, OPNsense 24.7, pfSense 7.2, Ubuntu 24.04, Wazuh single-node, Suricata, cloud-init*