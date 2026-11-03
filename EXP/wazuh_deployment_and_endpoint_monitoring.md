# Wazuh Endpoint Deployment & Monitoring

I deployed Wazuh Manager on an Ubuntu 22.04 VM running under my XCP-ng hypervisor (part of the network3.md Internal LAN) to gain visibility across my Linux and Windows endpoints. The install was straightforward: I added the Wazuh repository, installed the manager package, and started the service.

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

Once the agents were reporting, I configured the Wazuh manager to collect the data I needed. In `/var/ossec/etc/ossec.conf` I enabled:
- Syscheck for real-time file integrity monitoring on `/etc`, `/bin`, `/sbin`, `/usr/bin`, and `/var/log`
- Rootcheck for rootkit detection
- The CIS-CAT configuration assessment wodle to run daily scans against Ubuntu and Windows benchmarks
- The vulnerability detector wodle to check for outdated packages
- Log collection for `/var/log/auth.log` and `/var/log/syslog` (Linux) and the Windows Security, System, and Application event channels

I tested the file integrity monitoring by creating a test file in `/etc`:

```bash
sudo touch /etc/wazuh_test_fim
```

Within a minute, an alert appeared in the Wazuh dashboard (rule 550) indicating a file had been added. I also tested brute-force detection by generating failed SSH login attempts from another machine; after three failures within ten minutes, rule 100302 fired (a custom rule I later added for tuned thresholds).

The agents now provide continuous visibility: I can see vulnerability results in the Vulnerability Detection dashboard, configuration compliance in the CIS dashboard, and real-time file changes in the FIM view. This setup gave me the foundation to build detections and respond to threats in my lab environment.