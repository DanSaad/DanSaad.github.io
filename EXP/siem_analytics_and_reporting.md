# SIEM Analytics & Automated Reporting

Once my Wazuh agents were deployed and reporting data, I built a few dashboards to visualize the information and set up an automated daily report to save time on manual checks.

First, I created a Vulnerability Detection dashboard that pulls data from the vulnerability detector wodle. It shows the top CVEs by count across my endpoints, a table of vulnerable packages by agent (so I can see exactly which machines have which outdated software), and a trend line of critical and high severity vulnerabilities over the past 7 and 30 days. I added a filter so I can sort by agent group (Linux vs Windows) and severity, which helps me focus during morning triage — anything that's both critical and has a known exploit in the CISA KEV list gets immediate attention.

Next, I built a Configuration Assessment dashboard using the daily CIS-CAT scans. The dashboard shows the pass/fail rate for each benchmark (like SSH configuration or password policies), a detailed table of failed checks with remediation steps, and a drift view that highlights any new failures since yesterday's scan. This is how I caught a few systems with SSH root login still enabled and SMBv1 turned on — things that should be disabled in a secure environment.

For File Integrity Monitoring, I created a dashboard that shows real-time syscheck events. I made sure to exclude the `/var/log/*` directory from monitoring to avoid noise from log rotation, and I set up a special view for high-risk paths like `/etc/passwd`, `/etc/shadow`, `/etc/sudoers`, and the Windows hosts file. After establishing a two-week baseline of normal file change activity, anything unusual really pops out in this view.

The Threat & Geography dashboard combines data from multiple sources. It pulls in Suricata alerts (via the eve.json file that Wazuh ingests), combines them with host-based alerts from the Wazuh agent, and adds geographic context using GeoIP lookup on the source IPs. The main visualizations are a world map showing where attack traffic is originating from (sized by alert count), a MITRE ATT&CK heatmap that breaks down alerts by tactic and technique, and a table of the top attacking IP addresses enriched with VirusTotal data to show how many antivirus engines flagged them as malicious. I also added a pie chart that breaks down Suricata alerts by ruleset — so I can see how much is coming from ET Pro, Emerging Threats, or my own custom rules.

To avoid having to manually check everything every morning, I automated a daily report. I wrote a Python script that runs via cron at 6:00 AM. The script queries the Wazuh API for alert data and OpenSearch for the aggregated logs, then uses a Jinja2 template to generate an HTML report. The report includes sections for:
- Executive summary (total alerts, critical/high counts, new critical/high vulnerabilities with exploits, top 3 riskiest assets)
- Alert breakdown by the top 20 rules triggered
- Geographic threat summary (top source countries, notable malicious IPs)
- Vulnerability snapshot (recently detected critical/high issues)
- Configuration drift (new CIS failures since yesterday)
- FIM highlights (changes to high-risk paths)
- Suricata IDS summary (top signatures and source IPs)

The script uses WeasyPrint to convert the HTML to a PDF, then emails the report to myself and posts a summary to a Slack webhook. The whole process takes about 45 seconds from start to delivery.

Lately, I've been experimenting with adding some AI-powered analysis to the Suricata logs. I installed Ollama on my SIEM host and pulled the Llama 3.1 8B model. I wrote another script that runs hourly: it pulls the last hour of Suricata alerts from OpenSearch, batches them (max 50 per call to keep it fast), and sends them to the local LLM with a prompt asking it to look for low-and-slow campaigns, coordinated scanning activity, or beaconing patterns that signature-based rules might miss. The model returns a structured JSON response with an anomaly score, pattern type, affected IPs, and recommended action.

If the anomaly score is above 0.7 and the confidence is high, the script logs the result as a custom Wazuh alert (using rule ID 100400). In testing over a month, this approach caught four distributed SSH brute force attacks (where each IP only made one attempt per hour, so they flew under the radar of threshold-based rules) and two low-and-slow C2 beaconing patterns. The false positive rate was around 15%, which I reduced by tuning the confidence threshold to 0.75.

This setup has made my daily workflow much more efficient — I spend less time digging through raw logs and more time on actual threat hunting and improvement projects.