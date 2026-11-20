---
layout: page
title: Wazuh Deployment & Endpoint Monitoring
subtitle: Agent Rollout, FIM, CIS, Vulnerability Detection
category: ["SOC", "Systems Administration", "NetSec & IDS"]
type: "Professional Experience"
permalink: /EXP/wazuh_deployment_and_endpoint_monitoring/
---

I deployed Wazuh Manager on an Ubuntu 22.04 VM running under an XCP-ng hypervisor (see the [network diagram](/network3/)) to gain visibility across my Linux and Windows endpoints. The install was straightforward: I added the Wazuh repository, installed the manager package, and started the service.

```bash
curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | sudo gpg --dearmor -o /usr/share/keyrings/wazuh.gpg
echo "deb [signed-by=/usr/share/keyrings/wazuh.gpg] https://packages.wazuh.com/4.x/apt/ stable main" | sudo tee /etc/apt/sources.list.d/wazuh.list
sudo apt update && sudo apt install wazuh-manager
sudo systemctl enable wazuh-manager
sudo systemctl start wazuh-manager
```

After verifying the manager was active (`systemctl status wazuh-manager`), I rolled out the Wazuh agent to my endpoints. For the Ubuntu servers and workstations, I used the DEB package with auto-registration:

```bash
WAZUH_MANAGER=192.168.1.50 \
WAZUH_AGENT_NAME=$(hostname) \
WAZUH_AGENT_GROUP=linux \
WAZUH_REGISTRATION_PASSWORD=securepass123 \
sudo dpkg -i wazuh-agent_4.x_amd64.deb
sudo systemctl enable wazuh-agent
sudo systemctl start wazuh-agent
```

On the Windows endpoints, I used the MSI installer via PowerShell:

```powershell
msiexec /i wazuh-agent-4.x.msi /qn WAZUH_MANAGER=192.168.1.50 WAZUH_AGENT_GROUP=windows WAZUH_REGISTRATION_PASSWORD=securepass123
Start-Service wazuh-agent
```

Once the agents were reporting, I configured the Wazuh manager to collect the incoming data and waited for the first results. Within an hour, security alerts appeared on the Wazuh dashboard indicating a brute force ssh attack. Using the attackers' sourceIPs (included in the documentation of each alert), I was able to add a firewall rule to block their continued attempts to access the netowrk.

The agents now provide continuous visibility and threat detection, and I have since designed custom Dashboards to show the most salient threats to the network in real time.
