# Case Study: Securing Research Data via Linux Permission Management

## Project Overview
As part of my cybersecurity professional development, I completed a hands-on project focused on Linux file system security. In this case study, I acted as a security professional for a large organization's research team. My objective was to audit the existing file permissions within a project directory, determine if the permissions match the level of authorization that should be given, and modify any mis-matched permissions to authorize appropriate users and remove unauthorized access, following the **Principle of Least Privilege (PoLP)**.



## The Scenario
The research team stored sensitive data within a `projects` directory. I was tasked with identifying files and folders with overly broad permissions and modifying them to ensure that only authorized users had the necessary level of access. I had to ensure that:
1. No "Other" users had write access to any files.
2. The hidden file (`.project_x.txt`) was read-only for the owner and group, with no access for others.
3. The `projects` directory and its sub-directories was owned by `researcher2`, and that only `researcher2` could access the `drafts` sub-directory.

## My Approach and Methodology

### Phase 1: Initial Audit and Discovery
Before making any changes, I had to establish a baseline of the current environment. I navigated to the project directory and used the `ls -latr` command to view the contents.

**Terminal Output:**
```bash
researcher2@b7d28d38e7ef:~$ ls -latr
total 32
-rw-r--r-- 1 researcher2 research_team  220 Apr 18  2019 .bash_logout
drwxr-xr-x 1 root        root          4096 Jun  9 20:11 ..
-rw-r--r-- 1 researcher2 research_team 3574 Jun  9 20:11 .bashrc
-rw-r--r-- 1 researcher2 research_team 3574 Jun  9 20:11 .profile
drwxr-xr-x 3 researcher2 research_team 4096 Jun  9 20:11 projects
-rw------- 3 researcher2 research_team    6 Jun  9 20:10 .bash_history
drwxr-xr-x 3 researcher2 research_team 4096 Jun  9 20:11 .
researcher2@b7d28d38e7ef:~$ cd projects/
researcher2@b7d28d38e7ef:~/projects$ ls -latr
total 32
drwx--x--- 2 researcher2 research_team 4096 Jun  9 20:11 drafts
-rw-rw-rw- 1 researcher2 research_team   46 Jun  9 20:11 project_k.txt
-rw-r----- 1 researcher2 research_team   46 Jun  9 20:11 project_m.txt
-rw-rw-r-- 1 researcher2 research_team   46 Jun  9 20:11 project_r.txt
-rw--w---- 1 researcher2 research_team   46 Jun  9 20:11 project_t.txt
-rw--w---- 1 researcher2 research_team   46 Jun  9 20:11 .project_x.txt
drwxr-xr-x 3 researcher2 research_team 4096 Jun  9 20:11 .
drwxr-xr-x 3 researcher2 research_team 4096 Jun  9 21:10 ..
```

**Reasoning:**
I chose `-latr` because it is the most comprehensive way to view file details:
*   `-l`: Provides a long listing (permissions, owner, group, size, date).
*   `-a`: Ensures that **hidden files** (like `.project_x.txt`) are included in the output.
*   `-t`: Sorts by modification time.
*   `-r`: Reverses the order, putting the most recently modified files at the bottom.

**drafts**
* d (directory)
* rwx (user researcher2 can list contents [read], create, move, or delete contents [write], or traverse the directory / descend into a sub-directory the user has prior knowledge of [execute])
* --x (group research_team has permission to traverse the directory [execute], but lacks permissions to view or list contents (such as with ls) [disabled read bit] or modify contents (such as with touch or rm) [disabled write bit])
* --- (other users have no permissions)

**project_k.txt**
* \- (file)
* rw- (user researcher2 can read or write)
* rw- (group research_team can read or write)
* rw- (other users can read or write)

**project_m.txt**
* \- (file)
* rw- (user researcher2 can read or write)
* r-- (group research_team can read)
* --- (other users have no permissions)

**project_r.txt**
* \- (file)
* rw- (user researcher2 can read or write)
* rw- (group research_team can read or write)
* r-- (other users can read)

**project_t.txt**
* \- (file)
* rw- (user researcher2 can read or write)
* rw- (group research_team can read or write)
* r-- (other users can read)

**.project_x.txt**
* \- (file)
* rw- (user researcher2 can read or write)
* -w- (group research_team can write)
* --- (other users have no permissions)




### Phase 2: Remediation of Unauthorized Write Access
The organization’s primary policy was to prevent any "Other" user from having write access. I focused on `project_k.txt` to ensure the "Other" category was completely restricted from writing.

**Terminal Output:**
```bash
researcher2@b7d28d38e7ef:/projects$ chmod o-w project_k.txt
researcher2@b7d28d38e7ef:/projects$ ls -latr
total 32
drwxr-x--- 2 researcher2 research_team 4096 Jun  9 20:11 drafts
-rw-rw---- 1 researcher2 research_team  46 Jun  9 20:11 project_k.txt
-rw-rw---- 1 researcher2 research_team  46 Jun  9 20:11 project_m.txt
-rw-rw---- 1 researcher2 research_team  46 Jun  9 20:11 project_r.txt
-rw-rw---- 1 researcher2 research_team  46 Jun  9 20:11 project_t.txt
-rw-r--r-- 1 researcher2 research_team  46 Jun  9 20:11 .project_x.txt
drwxr-xr-x 3 researcher2 research_team 4096 Jun  9 20:11 .
drwxr-xr-x 3 researcher2 research_team 4096 Jun  9 21:10 ..
```


**Result:**
By executing the `chmod o-w` command, I stripped the write (`w`) permission from the "Other" category. The subsequent `ls -latr` confirmed that `project_k.txt` was successfully protected from unauthorized modification.

Another strategy for protecting files in bulk, had there been more than one such file would be as follows:
```bash
researcher2@b7d28d38e7ef:/projects$ chmod o-w *project_*.txt
```


### Phase 3: Securing Hidden Files
Next, I addressed `.project_x.txt`, which is not displayed by default and should be only readable by the owner and group.

**Terminal Output:**
```bash
researcher2@b7d28d38e7ef:/projects$ chmod u-w,g+r-w .project_x.txt
researcher2@b7d28d38e7ef:/projects$ ls -latr
total 32
drwx--x--- 2 researcher2 research_team 4096 Jun  9 20:11 drafts
-rw-rw-r-- 1 researcher2 research_team   46 Jun  9 20:11 project_k.txt
-rw-r----- 1 researcher2 research_team   46 Jun  9 20:11 project_m.txt
-rw-rw-r-- 1 researcher2 research_team   46 Jun  9 20:11 project_r.txt
-rw-rw-r-- 1 researcher2 research_team   46 Jun  9 20:11 project_t.txt
-r--r----- 1 researcher2 research_team   46 Jun  9 20:11 .project_x.txt
drwxr-xr-x 3 researcher2 research_team 4096 Jun  9 20:11 .
drwxr-xr-x 3 researcher2 research_team 4096 Jun  9 21:10 ..
```

The command adds read permissions to the Group research_team and removes write permissions from the user and group that had them.

### Phase 4: Restricting Directory Access
The final task was to secure the `projects` directory and its sub-directories. First, the owner should be `researcher2`. Second, only `researcher2` should be able to access `drafts`.

**Terminal Output:**
```bash
researcher2@b7d28d38e7ef:/projects$ chmod g-x drafts/
researcher2@b7d28d38e7ef:/projects$ ls -latr
total 32
drwx------ 2 researcher2 research_team 4096 Jun  9 20:11 drafts
-rw-rw-r-- 1 researcher2 research_team   46 Jun  9 20:11 project_k.txt
-rw-rw---- 1 researcher2 research_team   46 Jun  9 20:11 project_m.txt
-rw-rw-r-- 1 researcher2 research_team   46 Jun  9 20:11 project_r.txt
-rw-rw-r-- 1 researcher2 research_team   46 Jun  9 20:11 project_t.txt
-r--r----- 1 researcher2 research_team   46 Jun  9 20:11 .project_x.txt
drwxr-xr-x 3 researcher2 research_team 4096 Jun  9 20:11 .
drwxr-xr-x 3 researcher2 research_team 4096 Jun  9 21:10 ..
```

This command removes execute permissions from groups from the drafts folder, leaving sole access to user `researcher2`.

## Summary
Each step taken was done to restrict unnecessary and insecure access to files and directories or ensure access to users and groups within the organization on a strict **need-to-know** basis.
