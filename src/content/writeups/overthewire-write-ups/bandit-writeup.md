---
title: "Bandit-Writeup"
notion: "https://app.notion.com/p/1d717275170880858b8ac7032b1c3ea7"
order: 1
---

## Level 0:

As I was new to SSH and the Linux environment, I worked on my roommate's MacBook. I first learned about SSH, which stands for **Secure Shell**, used to operate securely over poorly secured networks. I discovered that the `-p` flag refers to the port, which in this case is `2220`.

```shell
ssh bandit0@bandit.labs.overthewire.org -p 2220
```

**Password:** `bandit0`

---

## Level 0 to 1:

After logging in, I found a file named `readme` in the home directory. I learned that the **home directory** is essentially a personal folder. I used the following commands:

```shell
ls       # to list files
cat readme  # to read the contents of the file
```

**Password:** `ZjLjTmM6FvvyRnrb2rfNWOZOTa6ip5If`

---

## Level 1 to 2:

I discovered a file named `-` (a tricky filename). I learned:

- `ls -a` shows all files, including hidden ones.
- `ls -l` shows detailed listing.

To read the file, I had to prevent the shell from interpreting it as a flag:

```shell
cat ./-
```

**Password:** `263JGJPfgU6LtdEvgfWU1XP5yac29mFx`

---

## Level 2 to 3:

The file had spaces in its name. I learned to use quotes or backslashes to handle that:

```shell
cat "spaces in this filename"
# or
cat spaces\ in\ this\ filename
```

**Password:** `MNk8KNH3Usiio41PRUEoDFPqfxLPlSmx`

---

## Level 3 to 4:

A hidden file existed inside a folder. I used:

```shell
cd inhere
ls -a
cat .hidden
```

**Password:** `2WmrDFRmJIq3IPxneAaMGhap0pFhF3NJ`

---

## Level 4 to 5:

The file was named `-file00`. To avoid misinterpretation:

```shell
cat ./-file00
```

**Password:** `4oQYVPkxZOOEOO5pTW81FB8j8lxXGUQw`

---

## Level 5 to 6:

The file was inside a folder named `inhere` and had a size of 1033 bytes and wasn't executable. I used:

```shell
cd inhere
find . -type f -size 1033c ! -executable
cat ./maybehere07/.file2
```

**Password:** `HWasnPhtq9AVKe0dmk45nxy20cvUa6EG`

---

## Level 6 to 7:

I had to search from the root directory for a file of size 33 bytes:

```shell
find / -user bandit7 -group bandit6 -size 33c 2>/dev/null
cat /var/lib/dpkg/info/bandit7.password
```

**Password:** `morbNTDkSW6jIlUc0ymOdMaLnOlFVAaj`

---

## Level 7 to 8:

The password was hidden among many lines. I learned to use `grep`:

```shell
cat data.txt | grep millionth
```

**Password:** `dfwvzFQi4mU0wfNbFOe9RoWskMLg7eEc`

---

## Level 8 to 9:

I used `sort` and `uniq` to find the unique line:

```shell
sort data.txt | uniq -u
```

**Password:** `4CKMh1JI91bUIZZPXDqGanal4xvAg0JM`

---

## Level 9 to 10:

The file was binary. I used `strings` and `grep`:

```shell
strings data.txt | grep "="
```

**Password:** `FGUW5ilLVJrxX9kMYMmlN4MgbpfMiqey`

---

## Level 10 to 11:

The file was base64 encoded:

```shell
base64 -d data.txt
```

**Password:** `dtR173fZKb0RRsDFSGsg2RWnpNVj3qRr`

---

## Level 11 to 12:

Text was ROT13 encoded:

```shell
cat data.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'
```

**Password:** `7x16WNeHIi5YkIhWsfFIqoognUTyj9Q4`

---

## Level 12 to 13:

The file was compressed in layers. I:

- Created a directory
- Moved and unpacked multiple compressed files

```shell
mkdir /tmp/mydir
cp data.txt /tmp/mydir
cd /tmp/mydir
xxd -r data.txt > data1
file data1
mv data1 data1.gz
gzip -d data1.gz
# Repeat with bzip2, tar, etc.
```

Eventually:

```shell
cat final_file
```

**Password:** *(obtained after full extraction process)*

---

## Level 13 to 14:

Logged in using SSH private key:

```shell
chmod 600 sshkey.private
ssh -i sshkey.private bandit14@localhost -p 2220
cat /etc/bandit_pass/bandit14
```

**Password:** *(from /etc/bandit_pass/bandit14)*

---

## Level 14 to 15:

Sent password using netcat:

```shell
echo "<password>" | nc localhost 30000
# or
cat /etc/bandit_pass/bandit14 | nc localhost 30000
```

**Password:** *(output from netcat)*
