# Project: Building a Real-Time Network Threat Detection Pipeline (Suricata + Wazuh)

## Overview
I developed a comprehensive security monitoring solution to demonstrate real-time threat detection and visualization. By integrating Suricata as an Intrusion Detection System (IDS) with the Wazuh SIEM platform, I built a pipeline capable of identifying, alerting on, and correlating network-level attacks with host-based security events. This project serves as a technical demonstration of my ability to configure, engineer, and validate a production-ready security stack.

## Project Architecture
In this project, I deployed a multi-layered environment:
*   **Attacker:** A Kali Linux VM used to simulate network probes and exploits.
*   **Detection Engine:** A target server running Suricata for deep packet inspection (DPI).
*   **SIEM & Visualization:** Wazuh for log aggregation, decoding, and real-time dashboarding.

## Technical Implementation

### 1. Suricata Configuration & Rule Management
My first priority was ensuring the IDS correctly identified "external" traffic. I configured Suricata’s `HOME_NET` variable in `/etc/suricata/suricata.yaml` to explicitly define the local host/LAN subnet range.

**Technical Step:**
I updated the configuration to include the specific host range (e.g., `192.168.1.50/31`):
```yaml
vars:
  address-groups:
    HOME_NET: "[192.168.1.50/31]"
```

**Technical Reasoning:**
I purposefully avoided the default configuration, where `HOME_NET` is set to the internal LAN and `EXTERNAL_NET` is defined as `!$HOME_NET`. This default behavior is designed for environments where threats originate from outside the LAN, but it ignores attacks originating from *inside* the LAN—such as from a compromised system or a dedicated attack VM residing on the same network.

To enable functional testing in my lab, I explicitly configured `HOME_NET` to include only the target machine's specific range (e.g., `192.168.1.50/31`) while excluding the attacker's IP. This configuration forces Suricata to treat the traffic from my Kali VM as external incoming traffic, allowing the IDS signatures to trigger as designed during the simulation.

**Deployment Note:** For a final production deployment, I would restore the `HOME_NET` definition to the appropriate enterprise subnet value, as the specific `/31` range used here is intended only for isolated attack testing.

After configuring the network variables, I updated the ruleset and restarted the service:
```bash
sudo suricata-update
sudo systemctl restart suricata
```

### 2. Integrating Logs with Wazuh
To get Suricata alerts into my dashboard, I needed to configure Wazuh to ingest the structured JSON output from Suricata’s `eve.json` log. I modified the Wazuh configuration (`/var/ossec/etc/ossec.conf`) by adding a `localfile` block.

**Technical Step:**
I inserted the following block near the **top** of the configuration file, directly under the primary `<ossec_config>` tag:
```xml
<ossec_config>
  <!-- Suricata Log Ingestion placed near top of file -->
  <localfile>
    <log_format>json</log_format>
    <location>/var/log/suricata/eve.json</location>
  </localfile>
  ...
</ossec_config>
```

**Best Practice:** I prioritized top-of-file placement for the Suricata log target. This ensures that the log target is processed immediately and prevents it from being accidentally overridden or skipped by subsequent configuration blocks, guaranteeing high-fidelity log ingestion.

### 3. Custom Rule Engineering & Severity Elevation
While Wazuh ingests Suricata alerts by default, many occur at lower severity levels. To make these actionable for a Security Operations Center (SOC) analyst, I engineered a custom rule in `/var/ossec/etc/rules/local_rules.xml`.

**Technical Step:**
I created a custom child rule to target standard Suricata alerts (SID 86601) and elevate high-risk threats:
```xml
<group name="suricata">
    <rule id="100301" level="12">
        <if_sid>86601</if_sid>
        <field name="alert.signature">Possible Command Injection|Malware|Exploit|Trojan</field>
        <description>Critical Suricata Network Intrusion Detected: $(data.alert.signature)</description>
        <group>ids,suricata_critical,</group>
    </rule>
</group>
```

**Technical Reasoning:**
I utilized `<if_sid>86601</if_sid>` to ensure the rule only evaluates when a standard Suricata alert is decoded. By using regex matching on the `alert.signature` field for keywords like "Command Injection" or "Exploit," I was able to isolate high-risk traffic. Elevating the `level` to 12 ensures these specific threats trigger top-tier dashboard highlights and active response mechanisms, filtering out routine network noise for the analyst.

I then restarted the Wazuh manager to apply the new logic:
```bash
sudo systemctl restart wazuh-manager
```

### 4. Validation and Threat Hunting
To validate the pipeline, I initiated an aggressive Nmap scan from the Kali VM against the target server.

**Attacker Command (Kali Linux):**
```bash
sudo nmap -sS -sV -A -T4 <TARGET_IP>
```

**Validation Command (Target Machine):**
I used `jq` to tail the `eve.json` file and filter for alert events in real-time:
```bash
sudo tail -f /var/log/suricata/eve.json | jq 'select(.event_type=="alert")'
```

**Results:**
The results were immediate. The Suricata IDS detected the probes, wrote them to the log, and Wazuh instantly visualized the event. On the Wazuh dashboard, I was able to filter by `rule.groups: suricata` to see the custom rule firing. This provided a unified view of the attack, showing the attacker's IP, target ports, matched signatures, and tactical mapping to the MITRE ATT&CK framework.

## Conclusion & Key Takeaways
This project demonstrated my ability to:
*   Deploy and configure enterprise-grade IDS (Suricata) and SIEM (Wazuh) solutions.
*   Apply technical reasoning to network configurations (e.g., CIDR range logic for IDS).
*   Perform custom rule engineering to transform raw alerts into actionable security intelligence.
*   Bridge the gap between raw network data and high-level threat intelligence for SOC operations.
