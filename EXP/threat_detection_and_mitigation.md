# Threat Detection & Active Mitigation

I worked on improving threat detection and response in my lab environment. I started by creating custom Wazuh rules to catch specific attack patterns that mattered to my setup.

First, I added a rule for SSH brute force attempts. I wanted to detect when an IP address made multiple failed SSH login attempts in a short time. I looked at the existing rule 5712 (which fires on each SSH failure) and created a new rule that triggered when the same source IP had three or more failures within ten minutes. I tested it by running a series of failed login attempts from another machine and verified that the alert appeared in the Wazuh dashboard with a custom rule ID.

Next, I created a rule to detect possible webshell uploads. I combined a Suricata signature for known webshell payloads with file integrity monitoring on the `/var/www` directory. The idea was that if Suricata saw a webshell download attempt and FIM showed a new file appearing in the web root, that was a stronger indicator of compromise. I tested this by downloading a harmless test file that matched the Suricata signature and confirming that both alerts fired and were correlated.

I also added rules for PowerShell encoded commands (looking for the `-enc` switch in Event ID 4104), LSASS access (a common sign of credential dumping tools like Mimikatz), and audit log clearing (Event ID 1102, which attackers use to cover their tracks). Each rule was tagged with the appropriate MITRE ATT&CK technique and tactic so they would appear in the MITRE heatmap dashboard.

To go beyond just detection, I configured active response for the high-severity rules. I wrote a simple script that calls the OPNsense firewall API (my DMZ firewall per network3.md) to block the source IP for one hour when a rule like the webshell or LSASS access rule triggered. I also set up a Windows isolation script that would use WinRM to add a blocking firewall rule on a compromised endpoint, though I haven’t needed to use that yet in testing.

To keep the blocklists current, I scheduled a daily script that pulls IP addresses from AbuseIPDB, AlienVault OTX, and the Emerging Threats blocklist, combines them, and pushes the list to my OPNsense firewall and Wazuh. This helps catch known bad actors automatically.

Finally, I ran weekly nmap scans across my Internal LAN, DMZ, and IoT VLANs (as laid out in network3.md) to watch for new services or open ports. This helped me find and close an accidentally exposed VNC port on one of my test servers.

The combination of custom rules, automated blocking, blocklist updates, and regular scanning has given me a much better view of what’s happening in my lab and reduced the time I spend on manual triage. It’s been a good introduction to detection engineering and the importance of tuning rules to reduce noise while catching real threats.

---

*Tools: Wazuh custom rules, active response, OPNsense API, nmap, VirusTotal, AbuseIPDB, OTX, Emerging Threats*