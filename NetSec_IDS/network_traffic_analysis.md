# Portfolio Project: Network Traffic Analysis & Incident Response

## Project Overview
**Title:** Decoding the Traffic: A Deep Dive into Log Analysis for Incident Response
**Role:** Cybersecurity Analyst (Coursework Simulation)
**Tools Used:** `tcpdump`, Network Traffic Analysis, ICMP/UDP Protocol Analysis

## Statement of Purpose
The objective of this project was to demonstrate my ability to perform systematic log analysis to diagnose and resolve complex network service disruptions. In a real-world cybersecurity environment, the ability to translate raw, high-volume packet data into a coherent narrative is essential for minimizing downtime and identifying potential security threats. This project showcases my methodology in isolating network-layer issues, interpreting protocol-specific errors, and providing actionable remediation steps for stakeholders.

## Technical Analysis Summary
During this investigation, I was tasked with diagnosing a service outage for the domain `www.yummyrecipesforme.com`. Customers reported a "destination port unreachable" error, which served as the primary lead for the investigation. 

Using the provided `tcpdump` logs, I conducted a multi-step analysis to identify the root cause:

### 1. Traffic Isolation and Trend Identification
I began by filtering the raw traffic to identify the primary protocols involved. By analyzing the flow of data, I successfully isolated the communication channels between the clients and the DNS servers. This allowed me to move past the "noise" of general network traffic to focus on the specific failure point.

### 2. Port Identification and DNS Resolution
The analysis revealed a recurring failure involving **Port 53**. Recognizing this as the standard port for **DNS (Domain Name System)**, I determined that the issue was not a general internet connectivity problem but a specific failure in DNS resolution. The logs confirmed that the system was attempting to resolve the requested domain, but the requests were consistently failing to reach the server.

### 3. ICMP Error Interpretation
The "smoking gun" in the analysis was the presence of **ICMP (Internet Control Message Protocol)** error messages. I analyzed the "Destination Port Unreachable" messages and correlated them with the DNS traffic on Port 53. This provided a clear narrative of the failure:
*   **Request:** Client requests a web address.
*   **Failure:** The network attempts to reach the DNS server, but Port 53 is not accepting connections.
*   **Response:** The network returns an ICMP error indicating the port is unreachable.

## Findings and Root Cause Analysis
Based on the detailed analysis in the *Cybersecurity Incident Report*, I identified two primary possibilities for the incident:
*   **Service-Level Configuration Issue:** The DNS service may have crashed or stopped running on the host server, meaning no process was listening on the receiving port.
*   **Network Security Obstruction:** A firewall rule may have been incorrectly configured to block external traffic to Port 53.
*   **Active Threat Scenario:** The server could be experiencing a **DDoS or DNS flood attack**, overwhelming Port 53 and preventing it from responding to legitimate queries.

## Recommendations
To resolve the issue and prevent recurrence, I proposed the following immediate actions to the IT team:
1.  **Service Verification:** Confirm if the DNS service is currently active on the host server.
2.  **Firewall Audit:** Review recent configuration changes to ensure Port 53 is explicitly allowed for external traffic.
3.  **Mitigation Planning:** If a flood attack is detected, implement stricter firewall configurations and rate-limiting to mitigate the impact of malicious traffic.

## Final Reflection
This project reinforced my ability to bypass symptoms and identify the underlying technical bottleneck. By focusing on log analysis, I demonstrated how a systematic approach—moving from broad traffic filtering to specific protocol analysis—can lead to a faster and more accurate resolution than manual troubleshooting alone.

***

## Appendix: Cybersecurity Incident Report (Source Document)
**Cybersecurity Incident Report: Network Traffic Analysis**

**Part 1: Provide a summary of the problem found in the DNS and ICMP traffic log.**
The UDP protocol reveals that:
*   The DNS server was unable to fulfill three consecutive DNS queries via the UDP protocol that retrieves the IP address associated with the website's domain name.
*   No ports were listening on the server, including port 53 which is associated with DNS service.
*   The ICMP error message 35084 included the A? Flag and the message "udp port 53 unreachable".
*   The UDP message requesting an IP address for the website never went through to the DNS server, as no service was listening on port 53 (receiving DNS port).

**3 attempts made:**
*   1:24 PM 32.192571s - 1:24 PM 36.0985564s (~4 second response time)
*   1:26 PM 32.192571s - 1:27 PM 15.934126s (~45 second response time)
*   1:28 PM 32.192571s - 1:28 PM 50.022967s (~18 second response time)

This is based on the results of the network analysis, which show that the ICMP echo reply returned the error message:
*   The A? Flag indicates the DNS request for an A record, which maps the domain name to an IP address.
*   The error message indicated that "udp port 53 unreachable", indicating that no service was listening on port 53 to receive the A record request.
*   The port noted in the error message is used for: Port 53 is used for DNS services; in this case specifically to take the requested URL and return an IP address to the client.

**The most likely issue is:**
The server may be under attack (potentially a DDoS or DNS flood) or there may be an issue with the firewall or network configurations incorrectly blocking internet traffic to port 53.

**Part 2: Explain your analysis of the data and provide at least one cause of the incident.**
**Time incident occurred:**
Initial incidents (customers of clients unable to access websites) occurred earlier in the day. After being informed, security team began to troubleshoot the issue (1:24 PM).

**Explain how the IT team became aware of the incident:**
The IT team received reports from customers of clients that the website "www.yummyrecipesforme.com" was unreachable and that they received the "destination port unreachable" error after waiting for the page to load.

**Explain the actions taken by the IT department to investigate the incident:**
The first step taken by the IT department was to attempt to replicate the issue — the investigator started by attempting to access the website, then used the network analyzer tool tcpdump to investigate the issue once the behavior was confirmed. After attempting to access the webpage again, the investigator analyzed the tcpdump log.

**Note key findings of the IT department's investigation (i.e., details related to the port affected, DNS server, etc.):**
*   **Key takeaways:**
    *   The DNS server was unresponsive, indicating there was no service listening on the receiving port.
    *   Port 53 (the receiving port) was unreachable, indicating it may be occupied by another process or access to it may be otherwise disabled.
    *   Two further attempts minutes apart were made to reach the DNS server and were still unsuccessful, indicating the issue is persistent.

**Note a likely cause of the incident:**
The IT department suspects two likely causes:
1.  The DNS service may be undergoing a DDoS attack or DNS flood attack, flooding Port 53 with traffic and preventing it from responding to legitimate queries.
2.  The operator of the DNS server may have mistakenly configured the firewall to block external access to port 53, preventing clients / customers of clients from reaching the server as intended.

In both cases, a key next step will be to check the firewall configuration — if the service is under attack, then a more strict configuration can mitigate the DDoS or DNS flood attack, whereas if the issue is in an erroneously strict configuration, allowing clients and their customers access to port 53 should resolve the issue.