# Navigating Security Data: A Case Study in SQL Filtering and Log Analysis

### Overview
As part of my cybersecurity professional development, I recently completed a project focused on security data analysis and incident investigation. In this case study, I assumed the role of a security professional tasked with analyzing two primary organizational datasets: an **employees** table and a **log_in_attempts** table.

My objective was to identify potential security breaches, such as unauthorized login attempts, and to extract specific employee data for departmental security updates. This project allowed me to demonstrate how structured SQL queries can be used to turn massive amounts of raw data into actionable intelligence. I have compiled my full technical documentation into a formal report, but in this post, I want to share my methodology and the logic I used to solve these specific challenges.

---

### The Methodology
Instead of tackling a massive dataset head-on, I knew I had to find ways to isolate specific indicators of compromise (IoCs) and organizational targets efficiently. My strategy relied on mastering four key SQL components:
1.  **Logical Operators** (`AND`, `OR`, `NOT`) for complex criteria.
2.  **Comparison Operators** (`>`, `<`) for time-series analysis.
3.  **Pattern Matching** (`LIKE`) for flexible string filtering (e.g., geographic data).
4.  **Sorting** (`ORDER BY`) to ensure the data was readable for stakeholders.

---

### Step-by-Step Investigation

#### 1. Identifying After-Hours Anomalies
The first task was to investigate a potential security incident involving failed logins after business hours. I needed to isolate attempts made after 18:00 to see if someone was attempting to brute-force the system during the night.

**My Approach:** I used a "greater than" filter on the `login_time` combined with an `AND` operator to isolate records where `success` was `FALSE`. This ensured the results only showed high-risk nocturnal failures, avoiding the clutter of successful daytime logins.

**SQL Query:**
```sql
SELECT * FROM log_in_attempts 
WHERE login_time > '18:00' AND success = FALSE;
```
**Sample Results:**
| employee_id | username | login_date | login_time | country | success |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 127 | abellmas | 2022-05-09 | 21:20:51 | CANADA | 0 |
| 131 | bisles | 2022-05-09 | 20:03:55 | US | 0 |
| 155 | cgriffin | 2022-05-12 | 22:18:42 | USA | 0 |
| 160 | jclark | 2022-05-10 | 20:49:00 | CANADA | 0 |
| 199 | yappiah | 2022-05-11 | 19:34:48 | MEXICO | 0 |
*(Total: 19 records)*

#### 2. Isolating Specific Event Windows
A suspicious event was reported on 2022-05-09. To understand the context, I needed to see the activity from that day and the day immediately preceding it.

**My Approach:** I wrote a query using the `OR` operator to capture both '2022-05-09' and '2022-05-08'. To make the results useful for a chronological timeline, I added an `ORDER BY` clause. This allowed me to see the sequence of events leading up to the incident.

**SQL Query:**
```sql
SELECT * FROM log_in_attempts 
WHERE login_date = '2022-05-09' OR login_date = '2022-05-08' 
ORDER BY login_date, login_time;
```
**Sample Results:**
| employee_id | username | login_date | login_time | country | success |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 83 | Irodriqu | 2022-05-08 | 09:11:34 | USA | 1 |
| 169 | alevitsk | 2022-05-08 | 09:21:16 | CANADA | 0 |
| 36 | asundara | 2022-05-08 | 12:09:10 | US | 1 |
| 1 | j soto | 2022-05-08 | 13:25:42 | US | 1 |
| 197 | ivelasco | 2022-05-08 | 14:00:01 | CANADA | 1 |
| 145 | d kot | 2022-05-08 | 14:40:02 | USA | 0 |
| 12 | tmi tchel | 2022-05-08 | 15:28:43 | MEX | 0 |
| 163 | nmason | 2022-05-08 | 17:16:13 | CAN | 1 |
| 53 | sbaelish | 2022-05-08 | 17:27:00 | US | 0 |
| 101 | alevitsk | 2022-05-08 | 21:58:32 | CANADA | 0 |
| 72 | sgilmore | 2022-05-08 | 22:38:31 | CAN | 1 |
*(Total: 83 records)*

#### 3. Geographic Filtering (Excluding Mexico)
The security team determined that a specific set of suspicious activities did not originate from Mexico. I was tasked with identifying all login attempts from everywhere *except* Mexico.

**My Approach:** This required a bit more nuance because the country column contained various entries like "MEX" and "MEXICO." I utilized the `NOT` operator in conjunction with `LIKE 'MEX%'`. The wildcard (`%`) ensured that any string starting with "MEX" was excluded, providing a cleaner dataset of international activity.

**SQL Query:**
```sql
SELECT * FROM log_in_attempts 
WHERE NOT country LIKE 'MEX%';
```
**Sample Results:**
| employee_id | username | login_date | country | success |
| :--- | :--- | :--- | :--- | :--- |
|  3 | jrafael | 2022-05-09 | CAN | 1 |
| 10 | apatel | 2022-05-10 | CAN | 0 |
| 11 | d kot | 2022-05-09 | USA | 1 |
| 12 | j rafael | 2022-05-09 | USA | 1 |
| 13 | eraab | 2022-05-08 | CANADA | 1 |
*(Total: 161 records)*

#### 4. Targeted Departmental Audits (Marketing & East Building)
The next phase involved identifying specific machines in the Marketing department located within the "East" building for security updates.

**My Approach:** I filtered the `employees` table for the "Marketing" department and applied a `LIKE 'East%'` filter to the `office` column. Since the offices were numbered (e.g., East-170, East-320), the `LIKE` operator was the most efficient way to capture all relevant locations in a single query.

**SQL Query:**
```sql
SELECT * FROM employees 
WHERE department = 'Marketing' AND office LIKE 'East%';
```
**Sample Results:**
| employee_id | device_id | username | department | office |
| :--- | :--- | :--- | :--- | :--- |
| 1000 | a320b137c219 | elarson | Marketing | East-170 |
| 1052 | a192b174c940 | j darosa | Marketing | East-195 |
| 1075 | x573y883z772 | fbautist | Marketing | East-267 |
| 1088 | k8651965m233 | rgosh | Marketing | East-157 |
| 1103 | a184b775c707 | randerss | Marketing | East-460 |
| 1156 | h679i515j339 | dellery | Marketing | East-417 |
| 1163 | a216 | cwi11iam | Marketing | East-216 |
*(Total: 7 records)*

#### 5. Grouped Departmental Updates (Sales & Finance)
Simultaneously, the team needed to identify employees in two different departments—Sales and Finance—for a separate update.

**My Approach:** I used the `OR` operator to create a single query that returned employees from both departments. This was more efficient than running two separate queries and merging them manually, ensuring a consolidated list for the update team.

**SQL Query:**
```sql
SELECT * FROM employees 
WHERE department = 'Sales' OR department = 'Finance';
```
**Sample Results:**
| employee_id | device_id | username | department | office |
| :--- | :--- | :--- | :--- | :--- |
| 135 | d394e816t943 | bsand | Sales | South-246 |
| 136 | h174i497j413 | mabadi | Sales | East-156 |
| 137 | i858j583k571 | jratael | Finance | West-246 |
| 139 | k2421212m542 | apatel | Finance | Central-270 |
| 140 | p611q262r945 | btang | Finance | Central-366 |
| 141 | r550s824t230 | btang | Finance | West-212 |
| 142 | s310t540u653 | gesparza | Finance | East-346 |
| 143 | w237x430y567 | jhill | Finance | South-11 |
| 144 | y976z753a267 | daquino | Finance | East-100 |
| 145 | z381a365b233 | ivelasco | Finance | East-7 |
*(Total: 1,185 records)*

#### 6. Exclusionary Filtering (Non-IT Personnel)
Finally, I had to identify every employee who was *not* in the Information Technology department to ensure they received a mandatory security update.

**My Approach:** Rather than listing every department in the company, I took the "path of least resistance" by using the `NOT` operator. By excluding "Information Technology," I automatically captured all other departments in the organization. This minimized the risk of missing a small department that might have been overlooked in a manual list.

**SQL Query:**
```sql
SELECT * FROM employees 
WHERE NOT department = 'Information Technology';
```
**Sample Results:**
| employee_id | device_id | username | department | office |
| :--- | :--- | :--- | :--- | :--- |
| 1001 | b239c825d303 | bmoreno | Marketing | East-170 |
| 1002 | cli6d593e558 | tshah | Human Resources | Central-276 |
| 1003 | d394e816f943 | sgilmore | Finance | South-153 |
| 1004 | e218f877g788 | eraab | Finance | South-127 |
| 1005 | f551g340h864 | gesparza | Human Resources | South-366 |
| 1007 | h174i497j413 | wj affrey | Human Resources | North-406 |
| 1008 | i858j583k571 | abernard | Human Resources | South-134 |
*(Total: 144 records)*

---

### Conclusion & Key Takeaways
This project reinforced the importance of precise data filtering in a security operations center (SOC). I learned that:
*   **Efficiency Matters:** Using `NOT` and `LIKE` can drastically reduce the amount of manual work required to clean a dataset.
*   **Context is King:** Sorting and specific logical combinations (like `AND` for time/success) are what turn "raw data" into "actionable intelligence."
*   **Accuracy in Patterns:** Using wildcards (`%`) is essential when dealing with inconsistent data entry (like "MEX" vs. "MEXICO").

By following this structured approach, I was able to provide the organization with a clear, filtered view of their security posture, ready for further incident response.
