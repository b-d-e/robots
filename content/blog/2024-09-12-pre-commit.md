+++
title = "🧩 Maintaining code quality with pre-commit"
[taxonomies]
  tags = ["reproducable-research", "testing-testing"]
+++


> shamelessly stolen from https://tallamjr.github.io/blog/2024/06/17/-maintaining-code-quality-with-pre-commit/

Some tips and tools to help keep research software _reproducible, reliable_ and _robust_.

<figure markdown="span">
    ![](https://imgs.xkcd.com/comics/code_quality.png){ width=100% }
  <figcaption>Code quality..</figcaption>
</figure>

<!-- more -->

In the realm of research software engineering, writing clean, maintainable, and
reproducible code is essential. Researchers often develop software that is
shared among teams, published at conferences or journals, or used to derive
critical results in adjacent fields. Adhering to best practices ensures that
your code is not only reliable but understandable and reproducible. This post
will hopefully give some motivation with examples and showcase several
technologies that can help make putting the best practises into practice easier.

The post will focus on using `pre-commit` for maintaining (or enforcing,
depending how you look at it) code quality, while other posts that will follow
will cover `pytest` for testing, and `git` for version control.

## ❓Why Best Practices Matter

1. **Reproducibility**: Ensures that research findings can be consistently replicated.
2. **Collaboration**: Makes it easier for team members to understand and contribute to the project.
3. **Maintenance**: Reduces the technical debt and makes the code easier to maintain and extend.
4. **Reliability**: Helps in catching bugs and issues early, ensuring robust software.

## ✅ **Code Quality with `pre-commit`**

Maintaining code quality is critical, and the `pre-commit` framework helps
automate this by running checks before code is committed. While some may seen
code style or quality a non-issue, having a consistent style or checking for
linting errors can relive the mental burden of the programmer significantly. It
is also amazingly easy to automate so why not get tools in place so you don't
need to even think about it.

While other frameworks are out there such as Husky[^1] and Overcommit[^2]
`pre-commit` allows developers to define a set of checks (hooks) that run before
a commit is made, ensuring code quality and consistency before it enters the
repository. These hooks can perform tasks such as code formatting, linting,
checking for secrets, or running tests. Originally created by Yelp in 2014, the
goal was to provide a common interface for pre-commit hooks across different
languages and projects, promoting best practices and code quality from the very
start of the development process.

[^1]: https://typicode.github.io/husky/
[^2]: https://github.com/sds/overcommit

### Getting Started with pre-commit

1. **Installation**:

The easiest way to install is via `pip`, but other options available too such as
`conda` etc. Let's put together a minimal repo and install our first pre-commit
checks.

???+ info
    For this demo example I will use other additional technologies but feel free
    to use whichever you are familiar with. This example will feature Hatch.

```console
$ hatch new hello
hello
├── src
│   └── hello
│       ├── __about__.py
│       └── __init__.py
├── tests
│   └── __init__.py
├── LICENSE.txt
├── README.md
└── pyproject.toml
✔ /tmp/hello (master) :: echo 'print("Hello, World!")' >> src/hello/main.py
```

2. **Configuration**:

When it is installed, one simply creates a `.pre-commit-config.yml` file in the root of the repo like so:

```yaml
# .pre-commit-config.yml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.0.1
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
  - repo: https://github.com/psf/black
    rev: 24.4.2
    hooks:
      - id: black
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.5.5
    hooks:
      - id: ruff
```

Don't worry, we will cover the hooks later on...

3. **Install pre-commit Hooks**:

    ```console
    $ pre-commit install
    ```

!!! note
    This will _only_ install the necessary hooks **_locally_**. It is important
    to stress that these do not take affect upstream even after a push. So it is
    encouraged in team development there are guidelines about setting up
    pre-commit.

???+ warning
    pre-commit naturally requires there to be a version control system in place
    to work. Otherwise you see the following error:
    ```console
    $ pre-commit install
    An error has occurred: FatalError: git failed. Is it installed, and are you
    in a Git repository directory?  Check the log at
    /Users/tallam/.cache/pre-commit/pre-commit.log
    ```

```console
$ pre-commit install
pre-commit installed at .git/hooks/pre-commit
```

4. **Run pre-commit**:

    You can manually run all hooks on all files:

    ```console
    $ pre-commit run --all-files
    ```

```console
$ pre-commit run --all-files
[INFO] Initializing environment for https://github.com/astral-sh/ruff-pre-commit.
[INFO] Installing environment for https://github.com/psf/black.
[INFO] Once installed this environment will be reused.
[INFO] This may take a few minutes...
[INFO] Installing environment for https://github.com/astral-sh/ruff-pre-commit.
[INFO] Once installed this environment will be reused.
[INFO] This may take a few minutes...
Trim Trailing Whitespace.................................................Passed
Fix End of Files.........................................................Passed
Check Yaml...............................................................Passed
Check for added large files..............................................Passed
black....................................................................Passed
ruff.....................................................................Passed
```

You may have noticed above that pre-commit has some built in checkers that are
very useful and have been highlighted below.

``` yaml hl_lines="3-9"
# .pre-commit-config.yml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.0.1
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
  - repo: https://github.com/psf/black
    rev: 24.4.2
    hooks:
      - id: black
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.5.5
    hooks:
      - id: ruff
```

One simple example is `trailing-whitespace` which will fail on extra white
space. Let's add some to the `main.py` file to see what happens.

```console
$ echo "     " >> src/hello/main.py
```
```diff
diff --git a/src/hello/main.py b/src/hello/main.py
index 7df869a..3c8ba12 100644
--- a/src/hello/main.py
+++ b/src/hello/main.py
@@ -1 +1,2 @@
 print("Hello, World!")
+

```

```console
$ git add . && git commit -m "whitespace test"
Trim Trailing Whitespace.................................................Failed
- hook id: trailing-whitespace
- exit code: 1
- files were modified by this hook

Fixing src/hello/main.py

Fix End of Files.........................................................Failed
- hook id: end-of-file-fixer
- exit code: 1
- files were modified by this hook

Fixing src/hello/main.py

Check Yaml...........................................(no files to check)Skipped
Check for added large files..............................................Passed
black....................................................................Passed
ruff.....................................................................Passed

```

Fail. But pre-commit can automatically apply the fix for you. So when we have another look we see it has already been removed:


```console
$ git status
On branch master
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   src/hello/main.py

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   src/hello/main.py
```

```diff
# git diff
diff --git a/src/hello/main.py b/src/hello/main.py
index 3c8ba12..7df869a 100644
--- a/src/hello/main.py
+++ b/src/hello/main.py
@@ -1,2 +1 @@
 print("Hello, World!")
-
```

```diff
# git diff --staged
diff --git a/src/hello/main.py b/src/hello/main.py
index 7df869a..3c8ba12 100644
--- a/src/hello/main.py
+++ b/src/hello/main.py
@@ -1 +1,2 @@
 print("Hello, World!")
+

```

This may seem annoying, "it's only whitespace...🙄", but as you can see above,
having the slightest change to what is expected can cause unnecessary diffs in
the git logs. This means it makes it that much harder for your team members
trying to get their head around complex code changes when there are random
changes that do not change the logic of the code and just becomes a distraction.
And trust me, when combing through 1000's of lines of code looking for a bug,
the less distractions and diff content the better!

As programmers we spend way more time reading code that writing it and so
enforcing code quality not only applies to silly examples like whitespace, but
even the consistency of indentation, or style of `if;else` blocks to name a few.
I'd encourage at this point to look at the built in hooks found here:
https://pre-commit.com/hooks.html

All can make a difference and having a strict enforcement of style will make
reading code far easier.

Some particularly useful ones are `black`: the "opinionated python formatter",
`ruff`: a blazingly fast linter for python and `mypy` for pseudo-type checking
of python code.

### Custom Hooks

The awesome thing about pre-commit is you can also create custom hooks to
enforce specific project requirements.

```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: custom-check
        name: Custom Check
        entry: ./scripts/custom-check.sh
        language: script
        files: \.py$
```

```bash title="./scripts/custom-check.sh"

#!/bin/bash
# Custom script for checking something specific
echo "Running custom check"
```

## Conclusion

Hopefully this has given you some motivation and also pointed you in the
direction where you can learn more about enforcing code quality in your
projects. Always strive to automate everything and if you can automate code
quality checks, why not?!

Happy coding! And be forceful _with style_

<figure markdown="span">
    ![](https://pbs.twimg.com/media/Dd1rIQwWsAAfmFE?format=jpg&name=medium){ width=80% }
</figure>
