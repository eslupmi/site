---
title: main
type: docs
bookToC: False
---

<div class="hero-intro">
  <h1>ChatOps incident management<br/>platform</h1>
  <p class="hero-description">Open-source, self-hosted platform to manage incidents<br/>where your team already works</p>
  <a href="https://github.com/eslupmi/impulse?tab=readme-ov-file#quick-start" class="btn btn-get-started" target="_blank">Get Started</a>
</div>


<div class="why-impulse-section">
  <div class="why-impulse-list">
    <div class="why-impulse-item">
      <div class="why-impulse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          <line x1="9" y1="10" x2="15" y2="10"></line>
          <line x1="9" y1="14" x2="13" y2="14"></line>
        </svg>
      </div>
      <div class="why-impulse-content">
        <strong>ChatOps approach</strong>
        <p>Work with incidents right where your team communicates</p>
      </div>
    </div>
    <div class="why-impulse-item">
      <div class="why-impulse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      </div>
      <div class="why-impulse-content">
        <strong>IaC ready</strong>
        <p>Store IMPulse configuration in your infrastructure repository</p>
      </div>
    </div>
    <div class="why-impulse-item">
      <div class="why-impulse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L2 22h20L12 2z"></path>
        </svg>
      </div>
      <div class="why-impulse-content">
        <strong>KISS principle</strong>
        <p>No extra components like databases, queues, or caches</p>
      </div>
    </div>
    <div class="why-impulse-item">
      <div class="why-impulse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>
      <div class="why-impulse-content">
        <strong>Easy migration from Alertmanager</strong>
        <p>Similar <a href="https://docs.impulse.bot/stable/config_file/#route" class="brand-color">route</a> and <a href="https://docs.impulse.bot/stable/config_file/#inhibition_rules" class="brand-color">inhibition_rules</a> configuration</p>
      </div>
    </div>
    <div class="why-impulse-item">
      <div class="why-impulse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      </div>
      <div class="why-impulse-content">
        <strong>Low resource usage</strong>
        <p>Minimal RAM and CPU consumption</p>
      </div>
    </div>
    <div class="why-impulse-item">
      <div class="why-impulse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
      </div>
      <div class="why-impulse-content">
        <strong>Free, self-hosted, open source</strong>
        <p>Fork it, extend it, or contribute — your stack, your rules</p>
      </div>
    </div>
  </div>
</div>

<a id="features"></a>
## Features
{{< features >}}

{{< feature-card title="Multiple messengers support" >}}
|- <a href="https://docs.impulse.bot/stable/integrations/messengers/slack/" class="brand-color">Slack</a>

|- <a href="https://docs.impulse.bot/stable/integrations/messengers/telegram/" class="brand-color">Telegram</a>

|- <a href="https://docs.impulse.bot/stable/integrations/messengers/mattermost/" class="brand-color">Mattermost</a>
{{< /feature-card >}}

{{< feature-card title="External integrations" >}}
Powerful <a href="https://docs.impulse.bot/stable/config_file/#webhooks" class="brand-color">webhooks</a> to integrate with any system
{{< /feature-card >}}

{{< feature-card title="No incident chaos" >}}
Incidents have a <a href="https://docs.impulse.bot/stable/concepts/incident/#lifecycle" class="brand-color">lifecycle</a> that automatically prevents duplicate incidents and reduces noise
{{< /feature-card >}}

{{< feature-card title="Snoozed incidents" >}}
<a href="https://docs.impulse.bot/features/snoozed-incidents/" class="brand-color">Freeze</a> incidents to handle them later
{{< /feature-card >}}

{{< feature-card title="Unlimited escalation policies" >}}
Create as many <a href="https://docs.impulse.bot/configuration/escalation/" class="brand-color">escalation policies</a> as you need
{{< /feature-card >}}

{{< feature-card title="High customization" >}}
Powerful <a href="https://docs.impulse.bot/configuration/templates/" class="brand-color">Jinja2 templates</a> to customize incident messages
{{< /feature-card >}}

{{< feature-card title="Task management integration" >}}
Create <a href="https://docs.impulse.bot/integrations/jira/" class="brand-color">Jira</a> tasks directly from messenger
{{< /feature-card >}}

{{< feature-card title="Unlimited oncall schedules" >}}
Set up flexible shifts and rotations from your <a href="https://docs.impulse.bot/configuration/oncall/#google-calendar" class="brand-color">Google Calendar</a>
{{< /feature-card >}}

{{< feature-card title="Parent/child incident suppression" >}}
<a href="https://docs.impulse.bot/features/suppression/" class="brand-color">Suppress</a> child incidents when a parent incident is active
{{< /feature-card >}}

{{< feature-card title="Privacy by design" >}}
No tracking, no data leaks. Perfect for <a href="https://docs.impulse.bot/security/" class="brand-color">sensitive</a> environments
{{< /feature-card >}}

{{< feature-card title="Community support" >}}
Ask questions and share ideas on <a href="https://github.com/eslupmi/impulse/discussions" class="brand-color">GitHub Discussions</a>
{{< /feature-card >}}
{{< /features >}}
