# Case Study: Analyzing Data Leaks through the Lens of Least Privilege

As part of my professional development in cybersecurity, I recently completed a case study focused on data handling practices and information privacy. This project required me to analyze a real-world style scenario involving a data breach, evaluate existing security controls, and propose actionable improvements based on industry standards.

In this post, I will walk through my methodology for identifying the root causes of a data leak and how I applied the **NIST SP 800-53** framework to develop a remediation strategy.

## The Scenario
The case study centered on an educational technology company. The organization faced a significant security incident where internal business plans—including sensitive customer analytics—were leaked on social media. 

The investigation revealed that a manager shared a folder containing a mix of public promotional materials and highly confidential internal documents with a sales team. Due to a lack of oversight, the permissions were never revoked. Subsequently, a sales representative shared a link to this folder with an external partner, who then posted the contents online.

## My Analytical Approach
To solve this assignment, I followed a structured four-step analytical process:

### 1. Root Cause Analysis
My first goal was to move beyond the "human error" surface level to find the systemic failures. I identified that the leak was caused by three primary factors:
*   **Improper Asset Classification:** Mixing different security levels (Public vs. Internal) in a single directory.
*   **Lack of Access Lifecycle Management:** Failing to revoke permissions once the specific task (the meeting) was complete.
*   **Compounded Human Error:** The representative's mistake was only possible because the previous two systemic failures existed.

### 2. Regulatory & Framework Research
To provide professional recommendations, I consulted the **NIST Special Publication 800-53**, specifically control **AC-6 (Least Privilege)**. This framework is a gold standard for establishing customizable information privacy plans. I focused on understanding how "Elevation of Privilege" threats occur when users are granted broader access than necessary to perform their job functions.

### 3. Developing Recommendations
Based on the NIST guidelines, I looked for "Control Enhancements." I wanted to move the company from a fully permissive model to a zero-trust model. My goal was to implement controls that make it technically difficult for a user to accidentally share the wrong data, or for unauthorized users to access privileged data.

### 4. Justification
Finally, I synthesized my findings into a justification for stakeholders. I focused on the concept of "reducing the blast radius"—ensuring that if one user makes a mistake, the amount of data exposed is minimized.

## The Solution
Below is the formal analysis I produced as part of my project. This worksheet summarizes the issues, the research findings, and my proposed security enhancements.

| Control | Least privilege |
| :--- | :--- |
| **Issue(s)** | Improper (lack of) division of assets of varying classification levels. Public and Internal-Only assets were bundled in the same folder, instead of being divided according to access. <br><br>Human error: If the materials were not to be shared, permissions should have been retracted based on least-privilege protocols. <br><br>Human error: the sales rep sent the wrong link, which was possible because of the prior two issues. As a result, an external business partner had access to internal-only information and made it public. |
| **Review** | The NIST entry addresses the principle of least privilege; specifically the Elevation of Privilege threat, which is a situation where a user attains access to data that they are not (or should not be) authorized for. |
| **Recommendation(s)** | **Proper storage and separation of data** <br>• Apply access restrictions (change permissions) to files and folders according to data classification; internal-only files should not be readable by external users. <br>• Keep data of different classifications in different directories, so that they can be handled according to frequency and spread of use. <br><br>**Regularly audit user privilege** <br>• Properly retracting access when data is no longer in use. <br>• If the internal-only materials were necessary for the meeting, but not to be accessed afterwards, the sharing link to the folder should have been deactivated. |
| **Justification** | If information is only accessible to people that need to use it, then data leaks become much rarer. Least privilege controls reduce the chance of erroneous data leaks, as well as purposeful ones from unauthorized users. Protecting privileged information protects the organization's reputation, helps ensure regulatory compliance, and ultimately protects the bottom line. Implementation of zero-trust architecture and least privilege principles minimizes the risk of human error and limits the scope of malicious internal actors, such as disgruntled employees with improperly elevated permissions. |

## Security Plan Snapshot
To provide context for these recommendations, I mapped the specific controls to the broader **NIST Cybersecurity Framework (CSF)** hierarchy. This ensures that the proposed changes align with the organization's overarching security goals.

| Function | Category | Subcategory | Reference(s) |
| :--- | :--- | :--- | :--- |
| Protect | PR.DS: Data security | PR.DS-5: Protections against data leaks. | NIST SP 800-53: AC-6 |

## Key Takeaways
This project reinforced a fundamental rule in cybersecurity: **Technology can mitigate human error, but processes must define the boundaries.** 

By implementing strict data classification (ensuring internal data is never stored with public data) and enforcing automated or manual access revocation, the company can significantly decrease its risk profile. Moving forward, I plan to apply these NIST-based principles to more complex network architecture designs.
