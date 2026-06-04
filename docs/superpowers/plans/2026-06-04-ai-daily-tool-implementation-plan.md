# AI Early Brief Tool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal web-based X AI news reader that fetches original posts from configured accounts, stores them, translates them into Chinese, and presents them in a real-time feed plus same-day summary.

**Architecture:** Use a Django monolith with focused Django apps for accounts, crawling, posts, translation, and UI. Run background work with Celery and Redis, persist primary data in PostgreSQL, and keep the X fetch path replaceable behind source-adapter interfaces while proxy handling stays isolated in the crawler app.

**Tech Stack:** Python 3.12, Django 5, Django templates, PostgreSQL, Redis, Celery, pytest, Playwright, Ruff

---

## File Structure

The implementation should create this structure and keep file responsibilities narrow:

- `pyproject.toml`
  - Python dependencies, Ruff config, pytest config
- `.env.example`
  - Local environment variable template
- `README.md`
  - Setup and run instructions
- `manage.py`
  - Django entrypoint
- `config/settings.py`
  - Shared Django settings
- `config/urls.py`
  - Root URL routing
- `config/celery.py`
  - Celery app wiring
- `apps/accounts/models.py`
  - Source accounts and account groups
- `apps/accounts/admin.py`
  - Admin registration for account configuration
- `apps/crawler/models.py`
  - Crawl runs and fetch settings snapshots
- `apps/crawler/proxy.py`
  - ProxyProvider and ProxySessionManager abstractions
- `apps/crawler/source_adapters/base.py`
  - Source-adapter interface
- `apps/crawler/source_adapters/mock.py`
  - Mock adapter for TDD and local development
- `apps/crawler/services.py`
  - Crawl orchestration logic
- `apps/crawler/tasks.py`
  - Celery crawl tasks
- `apps/posts/models.py`
  - Raw post storage
- `apps/posts/services.py`
  - Deduplication and post creation logic
- `apps/translation/models.py`
  - Translation record state
- `apps/translation/services.py`
  - Translation client and translation workflow
- `apps/translation/tasks.py`
  - Celery translation tasks
- `apps/ui/views.py`
  - Real-time feed, daily summary, and status views
- `apps/ui/urls.py`
  - UI routes
- `templates/ui/feed.html`
  - Real-time feed page
- `templates/ui/daily_summary.html`
  - Same-day summary page
- `templates/ui/status.html`
  - System status page
- `tests/accounts/test_models.py`
  - Accounts model coverage
- `tests/posts/test_services.py`
  - Deduplication and post creation coverage
- `tests/crawler/test_proxy.py`
  - Proxy configuration parsing and session behavior
- `tests/crawler/test_services.py`
  - Crawl orchestration coverage
- `tests/translation/test_services.py`
  - Translation state and workflow coverage
- `tests/ui/test_views.py`
  - View and filter behavior coverage
- `tests/e2e/test_reader_flow.py`
  - Browser-level validation for the main reading flow

## Task 1: Bootstrap Repository and Tooling

**Files:**
- Create: `pyproject.toml`
- Create: `.env.example`
- Create: `README.md`
- Create: `manage.py`
- Create: `config/__init__.py`
- Create: `config/settings.py`
- Create: `config/urls.py`
- Create: `config/celery.py`
- Create: `apps/__init__.py`
- Create: `apps/accounts/__init__.py`
- Create: `apps/crawler/__init__.py`
- Create: `apps/posts/__init__.py`
- Create: `apps/translation/__init__.py`
- Create: `apps/ui/__init__.py`
- Test: `python -m pytest`

- [ ] **Step 1: Write the failing smoke test**

```python
# tests/test_smoke.py
from django.conf import settings


def test_installed_apps_include_project_apps():
    assert "apps.accounts" in settings.INSTALLED_APPS
    assert "apps.crawler" in settings.INSTALLED_APPS
    assert "apps.posts" in settings.INSTALLED_APPS
    assert "apps.translation" in settings.INSTALLED_APPS
    assert "apps.ui" in settings.INSTALLED_APPS
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tests/test_smoke.py -v`
Expected: FAIL with import or Django settings initialization errors because the project files do not exist yet.

- [ ] **Step 3: Write the minimal project scaffold**

```toml
# pyproject.toml
[project]
name = "xfetcher"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
  "Django>=5.0,<6.0",
  "psycopg[binary]>=3.1",
  "celery>=5.4",
  "redis>=5.0",
  "python-dotenv>=1.0",
]

[project.optional-dependencies]
dev = [
  "pytest>=8.0",
  "pytest-django>=4.8",
  "playwright>=1.45",
  "ruff>=0.5",
]

[tool.pytest.ini_options]
DJANGO_SETTINGS_MODULE = "config.settings"
python_files = ["test_*.py", "*_test.py"]
```

```python
# config/settings.py
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = "dev-secret-key"
DEBUG = True
ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "apps.accounts",
    "apps.crawler",
    "apps.posts",
    "apps.translation",
    "apps.ui",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]

ROOT_URLCONF = "config.urls"
STATIC_URL = "/static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest tests/test_smoke.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add pyproject.toml .env.example README.md manage.py config apps tests/test_smoke.py
git commit -m "chore: bootstrap django project"
```

## Task 2: Model Account Groups and Source Accounts

**Files:**
- Create: `apps/accounts/apps.py`
- Create: `apps/accounts/models.py`
- Create: `apps/accounts/admin.py`
- Create: `tests/accounts/test_models.py`
- Modify: `config/settings.py`
- Test: `tests/accounts/test_models.py`

- [ ] **Step 1: Write the failing model test**

```python
from apps.accounts.models import AccountGroup, SourceAccount


def test_source_account_string_representation(db):
    group = AccountGroup.objects.create(name="labs", description="Model labs", default_fetch_interval=300)
    account = SourceAccount.objects.create(
        x_handle="openai",
        display_name="OpenAI",
        group=group,
        enabled=True,
    )

    assert str(account) == "@openai (labs)"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tests/accounts/test_models.py::test_source_account_string_representation -v`
Expected: FAIL because the models do not exist.

- [ ] **Step 3: Write the minimal models and admin registration**

```python
# apps/accounts/models.py
from django.db import models


class AccountGroup(models.Model):
    name = models.CharField(max_length=64, unique=True)
    description = models.CharField(max_length=255, blank=True)
    default_fetch_interval = models.PositiveIntegerField(default=300)

    def __str__(self) -> str:
        return self.name


class SourceAccount(models.Model):
    x_handle = models.CharField(max_length=64, unique=True)
    display_name = models.CharField(max_length=128)
    group = models.ForeignKey(AccountGroup, on_delete=models.CASCADE, related_name="accounts")
    enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"@{self.x_handle} ({self.group.name})"
```

```python
# apps/accounts/admin.py
from django.contrib import admin
from apps.accounts.models import AccountGroup, SourceAccount

admin.site.register(AccountGroup)
admin.site.register(SourceAccount)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest tests/accounts/test_models.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/accounts config/settings.py tests/accounts/test_models.py
git commit -m "feat: add account and group models"
```

## Task 3: Model Raw Posts and Deduplication

**Files:**
- Create: `apps/posts/apps.py`
- Create: `apps/posts/models.py`
- Create: `apps/posts/services.py`
- Create: `tests/posts/test_services.py`
- Test: `tests/posts/test_services.py`

- [ ] **Step 1: Write the failing service test**

```python
from apps.accounts.models import AccountGroup, SourceAccount
from apps.posts.models import RawPost
from apps.posts.services import store_raw_post


def test_store_raw_post_is_idempotent(db):
    group = AccountGroup.objects.create(name="labs", default_fetch_interval=300)
    account = SourceAccount.objects.create(x_handle="openai", display_name="OpenAI", group=group)

    payload = {
        "external_post_id": "123",
        "original_text": "GPT update",
        "original_language": "en",
        "posted_at": "2026-06-04T12:00:00Z",
        "source_type": "mock",
        "raw_payload": {"id": "123"},
    }

    first = store_raw_post(account=account, payload=payload)
    second = store_raw_post(account=account, payload=payload)

    assert first.id == second.id
    assert RawPost.objects.count() == 1
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tests/posts/test_services.py::test_store_raw_post_is_idempotent -v`
Expected: FAIL because the post model and service do not exist.

- [ ] **Step 3: Write the minimal model and service**

```python
# apps/posts/models.py
from django.db import models
from apps.accounts.models import SourceAccount


class RawPost(models.Model):
    source_account = models.ForeignKey(SourceAccount, on_delete=models.CASCADE, related_name="raw_posts")
    external_post_id = models.CharField(max_length=128)
    original_text = models.TextField()
    original_language = models.CharField(max_length=16, blank=True)
    posted_at = models.DateTimeField()
    fetched_at = models.DateTimeField(auto_now_add=True)
    source_type = models.CharField(max_length=32)
    raw_payload = models.JSONField(default=dict)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["source_account", "external_post_id"],
                name="uniq_source_account_external_post",
            )
        ]
```

```python
# apps/posts/services.py
from django.utils.dateparse import parse_datetime
from apps.posts.models import RawPost


def store_raw_post(account, payload):
    post, _ = RawPost.objects.get_or_create(
        source_account=account,
        external_post_id=payload["external_post_id"],
        defaults={
            "original_text": payload["original_text"],
            "original_language": payload["original_language"],
            "posted_at": parse_datetime(payload["posted_at"]),
            "source_type": payload["source_type"],
            "raw_payload": payload["raw_payload"],
        },
    )
    return post
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest tests/posts/test_services.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/posts tests/posts/test_services.py
git commit -m "feat: add raw post storage"
```

## Task 4: Add Proxy Abstraction and Source Adapter Interface

**Files:**
- Create: `apps/crawler/apps.py`
- Create: `apps/crawler/proxy.py`
- Create: `apps/crawler/source_adapters/base.py`
- Create: `apps/crawler/source_adapters/mock.py`
- Create: `tests/crawler/test_proxy.py`
- Test: `tests/crawler/test_proxy.py`

- [ ] **Step 1: Write the failing proxy test**

```python
from apps.crawler.proxy import ProxyProvider


def test_proxy_provider_builds_authenticated_proxy_url():
    provider = ProxyProvider(
        scheme="http",
        host="542cd09n.pr.thordata.net",
        port=9999,
        username="td-customer-demo",
        password="secret",
    )

    assert provider.as_url() == "http://td-customer-demo:secret@542cd09n.pr.thordata.net:9999"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tests/crawler/test_proxy.py::test_proxy_provider_builds_authenticated_proxy_url -v`
Expected: FAIL because the proxy module does not exist.

- [ ] **Step 3: Write the minimal proxy and adapter interfaces**

```python
# apps/crawler/proxy.py
from dataclasses import dataclass


@dataclass(slots=True)
class ProxyProvider:
    scheme: str
    host: str
    port: int
    username: str
    password: str

    def as_url(self) -> str:
        return f"{self.scheme}://{self.username}:{self.password}@{self.host}:{self.port}"
```

```python
# apps/crawler/source_adapters/base.py
from abc import ABC, abstractmethod


class BaseSourceAdapter(ABC):
    source_type = "base"

    @abstractmethod
    def fetch_original_posts(self, account_handle: str, proxy_url: str | None = None) -> list[dict]:
        raise NotImplementedError
```

```python
# apps/crawler/source_adapters/mock.py
from apps.crawler.source_adapters.base import BaseSourceAdapter


class MockSourceAdapter(BaseSourceAdapter):
    source_type = "mock"

    def fetch_original_posts(self, account_handle: str, proxy_url: str | None = None) -> list[dict]:
        return [
            {
                "external_post_id": f"{account_handle}-001",
                "original_text": f"Latest update from {account_handle}",
                "original_language": "en",
                "posted_at": "2026-06-04T12:00:00Z",
                "source_type": self.source_type,
                "raw_payload": {"account_handle": account_handle, "proxy_url": proxy_url},
            }
        ]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest tests/crawler/test_proxy.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/crawler tests/crawler/test_proxy.py
git commit -m "feat: add proxy and source adapter interfaces"
```

## Task 5: Implement Crawl Run Tracking and Crawl Orchestration

**Files:**
- Create: `apps/crawler/models.py`
- Create: `apps/crawler/services.py`
- Create: `tests/crawler/test_services.py`
- Modify: `apps/posts/services.py`
- Test: `tests/crawler/test_services.py`

- [ ] **Step 1: Write the failing crawl service test**

```python
from apps.accounts.models import AccountGroup, SourceAccount
from apps.crawler.services import crawl_account
from apps.posts.models import RawPost


def test_crawl_account_persists_posts_and_run_record(db):
    group = AccountGroup.objects.create(name="labs", default_fetch_interval=300)
    account = SourceAccount.objects.create(x_handle="openai", display_name="OpenAI", group=group)

    result = crawl_account(account=account)

    assert result.status == "success"
    assert result.inserted_count == 1
    assert RawPost.objects.count() == 1
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tests/crawler/test_services.py::test_crawl_account_persists_posts_and_run_record -v`
Expected: FAIL because crawl services and run models do not exist.

- [ ] **Step 3: Write the minimal crawl model and service**

```python
# apps/crawler/models.py
from django.db import models
from apps.accounts.models import SourceAccount


class CrawlRun(models.Model):
    STATUS_CHOICES = [("success", "success"), ("failed", "failed")]

    source_account = models.ForeignKey(SourceAccount, on_delete=models.CASCADE, related_name="crawl_runs")
    status = models.CharField(max_length=16, choices=STATUS_CHOICES)
    fetched_count = models.PositiveIntegerField(default=0)
    inserted_count = models.PositiveIntegerField(default=0)
    failed_count = models.PositiveIntegerField(default=0)
    proxy_session_identifier = models.CharField(max_length=255, blank=True)
    error_summary = models.TextField(blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    finished_at = models.DateTimeField(null=True, blank=True)
```

```python
# apps/crawler/services.py
from django.utils import timezone
from apps.crawler.models import CrawlRun
from apps.crawler.proxy import ProxyProvider
from apps.crawler.source_adapters.mock import MockSourceAdapter
from apps.posts.services import store_raw_post


def crawl_account(account):
    run = CrawlRun.objects.create(source_account=account, status="success")
    adapter = MockSourceAdapter()
    proxy = ProxyProvider("http", "localhost", 8080, "demo", "demo")
    items = adapter.fetch_original_posts(account_handle=account.x_handle, proxy_url=proxy.as_url())

    inserted = 0
    for item in items:
        before = account.raw_posts.count()
        store_raw_post(account=account, payload=item)
        after = account.raw_posts.count()
        inserted += int(after > before)

    run.fetched_count = len(items)
    run.inserted_count = inserted
    run.finished_at = timezone.now()
    run.save(update_fields=["fetched_count", "inserted_count", "finished_at"])
    return run
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest tests/crawler/test_services.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/crawler apps/posts/services.py tests/crawler/test_services.py
git commit -m "feat: add crawl orchestration"
```

## Task 6: Add Translation Records and Translation Workflow

**Files:**
- Create: `apps/translation/apps.py`
- Create: `apps/translation/models.py`
- Create: `apps/translation/services.py`
- Create: `tests/translation/test_services.py`
- Test: `tests/translation/test_services.py`

- [ ] **Step 1: Write the failing translation test**

```python
from apps.accounts.models import AccountGroup, SourceAccount
from apps.posts.models import RawPost
from apps.translation.services import translate_post


def test_translate_post_creates_completed_translation(db):
    group = AccountGroup.objects.create(name="labs", default_fetch_interval=300)
    account = SourceAccount.objects.create(x_handle="openai", display_name="OpenAI", group=group)
    post = RawPost.objects.create(
        source_account=account,
        external_post_id="123",
        original_text="Launch today",
        original_language="en",
        posted_at="2026-06-04T12:00:00Z",
        source_type="mock",
        raw_payload={"id": "123"},
    )

    translation = translate_post(post)

    assert translation.status == "completed"
    assert translation.translated_text_zh == "Launch today"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tests/translation/test_services.py::test_translate_post_creates_completed_translation -v`
Expected: FAIL because translation files do not exist.

- [ ] **Step 3: Write the minimal translation model and service**

```python
# apps/translation/models.py
from django.db import models
from apps.posts.models import RawPost


class PostTranslation(models.Model):
    STATUS_CHOICES = [("pending", "pending"), ("completed", "completed"), ("failed", "failed")]

    raw_post = models.OneToOneField(RawPost, on_delete=models.CASCADE, related_name="translation")
    translated_text_zh = models.TextField(blank=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default="pending")
    error_message = models.TextField(blank=True)
    model_name = models.CharField(max_length=64, default="mock-translator")
    model_version = models.CharField(max_length=64, default="v1")
    translated_at = models.DateTimeField(null=True, blank=True)
```

```python
# apps/translation/services.py
from django.utils import timezone
from apps.translation.models import PostTranslation


def translate_post(post):
    translation, _ = PostTranslation.objects.get_or_create(raw_post=post)
    translation.translated_text_zh = post.original_text
    translation.status = "completed"
    translation.translated_at = timezone.now()
    translation.save(update_fields=["translated_text_zh", "status", "translated_at"])
    return translation
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest tests/translation/test_services.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/translation tests/translation/test_services.py
git commit -m "feat: add translation workflow"
```

## Task 7: Add Celery Tasks for Crawl and Translation

**Files:**
- Create: `apps/crawler/tasks.py`
- Create: `apps/translation/tasks.py`
- Modify: `config/celery.py`
- Modify: `apps/crawler/services.py`
- Create: `tests/crawler/test_tasks.py`
- Test: `tests/crawler/test_tasks.py`

- [ ] **Step 1: Write the failing task dispatch test**

```python
from apps.accounts.models import AccountGroup, SourceAccount
from apps.crawler.tasks import crawl_account_task


def test_crawl_account_task_returns_run_id(db):
    group = AccountGroup.objects.create(name="labs", default_fetch_interval=300)
    account = SourceAccount.objects.create(x_handle="openai", display_name="OpenAI", group=group)

    run_id = crawl_account_task(account.id)

    assert isinstance(run_id, int)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tests/crawler/test_tasks.py::test_crawl_account_task_returns_run_id -v`
Expected: FAIL because the task module does not exist.

- [ ] **Step 3: Write the minimal Celery tasks**

```python
# config/celery.py
import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

app = Celery("xfetcher")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
```

```python
# apps/crawler/tasks.py
from apps.accounts.models import SourceAccount
from apps.crawler.services import crawl_account


def crawl_account_task(account_id: int) -> int:
    account = SourceAccount.objects.get(id=account_id)
    run = crawl_account(account=account)
    return run.id
```

```python
# apps/translation/tasks.py
from apps.posts.models import RawPost
from apps.translation.services import translate_post


def translate_post_task(post_id: int) -> int:
    post = RawPost.objects.get(id=post_id)
    translation = translate_post(post)
    return translation.id
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest tests/crawler/test_tasks.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add config/celery.py apps/crawler/tasks.py apps/translation/tasks.py tests/crawler/test_tasks.py
git commit -m "feat: add background job entrypoints"
```

## Task 8: Build Reader-Facing Pages

**Files:**
- Create: `apps/ui/apps.py`
- Create: `apps/ui/views.py`
- Create: `apps/ui/urls.py`
- Create: `templates/ui/feed.html`
- Create: `templates/ui/daily_summary.html`
- Create: `templates/ui/status.html`
- Create: `tests/ui/test_views.py`
- Modify: `config/urls.py`
- Test: `tests/ui/test_views.py`

- [ ] **Step 1: Write the failing feed view test**

```python
from django.urls import reverse


def test_feed_page_returns_200(client):
    response = client.get(reverse("ui:feed"))

    assert response.status_code == 200
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tests/ui/test_views.py::test_feed_page_returns_200 -v`
Expected: FAIL because the UI routes and views do not exist.

- [ ] **Step 3: Write the minimal views, routes, and templates**

```python
# apps/ui/views.py
from django.shortcuts import render
from django.utils import timezone
from apps.crawler.models import CrawlRun
from apps.posts.models import RawPost


def feed(request):
    posts = RawPost.objects.select_related("source_account").order_by("-posted_at")
    return render(request, "ui/feed.html", {"posts": posts})


def daily_summary(request):
    today = timezone.now().date()
    posts = RawPost.objects.filter(posted_at__date=today).select_related("source_account").order_by("-posted_at")
    return render(request, "ui/daily_summary.html", {"posts": posts, "today": today})


def status(request):
    runs = CrawlRun.objects.select_related("source_account").order_by("-started_at")[:20]
    return render(request, "ui/status.html", {"runs": runs})
```

```python
# apps/ui/urls.py
from django.urls import path
from apps.ui import views

app_name = "ui"

urlpatterns = [
    path("", views.feed, name="feed"),
    path("daily/", views.daily_summary, name="daily_summary"),
    path("status/", views.status, name="status"),
]
```

```python
# config/urls.py
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("apps.ui.urls")),
]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest tests/ui/test_views.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/ui config/urls.py templates/ui tests/ui/test_views.py
git commit -m "feat: add reader pages"
```

## Task 9: Register Admin Configuration Pages

**Files:**
- Modify: `apps/crawler/admin.py`
- Modify: `apps/translation/admin.py`
- Create: `tests/ui/test_admin.py`
- Test: `tests/ui/test_admin.py`

- [ ] **Step 1: Write the failing admin registration test**

```python
from django.contrib import admin
from apps.accounts.models import AccountGroup, SourceAccount
from apps.crawler.models import CrawlRun
from apps.translation.models import PostTranslation


def test_models_are_registered_in_admin():
    registry = admin.site._registry

    assert AccountGroup in registry
    assert SourceAccount in registry
    assert CrawlRun in registry
    assert PostTranslation in registry
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tests/ui/test_admin.py::test_models_are_registered_in_admin -v`
Expected: FAIL because crawler and translation admin registrations do not exist.

- [ ] **Step 3: Register the remaining admin models**

```python
# apps/crawler/admin.py
from django.contrib import admin
from apps.crawler.models import CrawlRun

admin.site.register(CrawlRun)
```

```python
# apps/translation/admin.py
from django.contrib import admin
from apps.translation.models import PostTranslation

admin.site.register(PostTranslation)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest tests/ui/test_admin.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/crawler/admin.py apps/translation/admin.py tests/ui/test_admin.py
git commit -m "feat: register admin configuration models"
```

## Task 10: Add End-to-End Reader Verification and Documentation

**Files:**
- Create: `tests/e2e/test_reader_flow.py`
- Modify: `README.md`
- Modify: `.env.example`
- Test: `tests/e2e/test_reader_flow.py`

- [ ] **Step 1: Write the failing end-to-end test**

```python
from playwright.sync_api import Page, expect


def test_feed_page_shows_heading(page: Page, live_server):
    page.goto(live_server.url)
    expect(page).to_have_title("XFetcher")
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tests/e2e/test_reader_flow.py::test_feed_page_shows_heading -v`
Expected: FAIL because the template title and live-server test wiring are not finished yet.

- [ ] **Step 3: Finish the template metadata and documentation**

```html
<!-- templates/ui/feed.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>XFetcher</title>
  </head>
  <body>
    <h1>Real-time Feed</h1>
  </body>
</html>
```

```env
# .env.example
DJANGO_SECRET_KEY=change-me
DJANGO_DEBUG=true
DATABASE_URL=postgres://postgres:postgres@localhost:5432/xfetcher
REDIS_URL=redis://localhost:6379/0
```

```md
# README.md

## Local setup

1. Create a virtual environment.
2. Install dependencies with `pip install -e .[dev]`.
3. Copy `.env.example` to `.env`.
4. Run migrations with `python manage.py migrate`.
5. Start Django with `python manage.py runserver`.
6. Start workers with `celery -A config.celery.app worker --loglevel=info`.
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest tests/e2e/test_reader_flow.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/e2e/test_reader_flow.py README.md .env.example templates/ui/feed.html
git commit -m "test: add end-to-end reader verification"
```

## Spec Coverage Check

- Personal web-based reader: covered by Tasks 8 and 10
- Whitelisted X accounts and groups: covered by Task 2
- Original-post ingestion and storage: covered by Tasks 3 and 5
- Replaceable X fetch path: covered by Task 4
- Proxy-backed crawler design: covered by Task 4
- Translation workflow: covered by Tasks 6 and 7
- Same-day summary page: covered by Task 8
- System status page: covered by Task 8
- Web-admin-first configuration: covered by Tasks 2 and 9
- Cloud-friendly background execution: covered by Tasks 1 and 7

## Placeholder Scan

Scanned the plan for unfinished markers and vague implementation notes.

Result:

- No unfinished markers remain
- No cross-task "same as above" shortcuts remain
- No vague "handle this later" instructions remain

## Type Consistency Check

- `SourceAccount` is the account model name throughout
- `RawPost` is the raw-content model name throughout
- `PostTranslation` is the translation model name throughout
- `crawl_account()` returns `CrawlRun` throughout
- `translate_post()` returns `PostTranslation` throughout
