---
title: main
type: docs
bookToC: False
---

<div class="hero-intro">
  <h1>ChatOps Incident Management<br/>Platform</h1>
  <p class="hero-description">Open-source, self-hosted platform to manage incidents where your team already works</p>
</div>

<div class="hero-preview">
  <img src="/preview.png" alt="IMPulse preview" class="hero-preview-img">
  <p class="hero-preview-text">for teams that own their data</p>
</div>

<section class="why-impulse-fullwidth">
  <div class="why-impulse-section">
    <div class="why-impulse-list">
      <div class="why-impulse-item">
        <div class="why-impulse-header">
          <div class="why-impulse-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>
          <strong>IaC ready</strong>
        </div>
        <div class="why-impulse-content">
          <p>Store IMPulse configuration in your infrastructure repository</p>
        </div>
      </div>
      <div class="why-impulse-item">
        <div class="why-impulse-header">
          <div class="why-impulse-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 22h20L12 2z"></path>
            </svg>
          </div>
          <strong>KISS principle</strong>
        </div>
        <div class="why-impulse-content">
          <p>No extra components like databases, queues, or caches</p>
        </div>
      </div>
      <div class="why-impulse-item">
        <div class="why-impulse-header">
          <div class="why-impulse-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
          <strong>Easy migration from Alertmanager</strong>
        </div>
        <div class="why-impulse-content">
          <p>Similar <a href="https://docs.impulse.bot/stable/config_file/#route" class="brand-color">route</a> and <a href="https://docs.impulse.bot/stable/config_file/#inhibition_rules" class="brand-color">inhibition rules</a> configuration</p>
        </div>
      </div>
      <div class="why-impulse-item">
        <div class="why-impulse-header">
          <div class="why-impulse-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="9" y1="12" x2="13" y2="12"></line>
            </svg>
          </div>
          <strong>ChatOps approach</strong>
        </div>
        <div class="why-impulse-content">
          <p>Work with incidents right where your team communicates</p>
        </div>
      </div>
      <div class="why-impulse-item">
        <div class="why-impulse-header">
          <div class="why-impulse-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <strong>Low resource usage</strong>
        </div>
        <div class="why-impulse-content">
          <p>Minimal RAM and CPU consumption</p>
        </div>
      </div>
      <div class="why-impulse-item">
        <div class="why-impulse-header">
          <div class="why-impulse-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </div>
          <strong>Free, self-hosted, open source</strong>
        </div>
        <div class="why-impulse-content">
          <p>Fork it, extend it, or contribute — your stack, your rules</p>
        </div>
      </div>
      <div class="why-impulse-item">
        <div class="why-impulse-header">
          <div class="why-impulse-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <strong>Privacy by design</strong>
        </div>
        <div class="why-impulse-content">
          <p>No tracking, no data leaks. Perfect for sensitive environments</p>
        </div>
      </div>
    </div>
  </div>
</section>

<a id="features"></a>
## Features

<div class="tiles-grid">
  <!-- 1 row -->
  <div class="tile tile-feature tile-w1">
    <div class="tile-feature-text">
      <h3 class="tile-feature-title">Alert sources</h3>
      <p class="tile-feature-description">Alertmanager and Grafana support</p>
    </div>
    <div class="tile-feature-icons-overlapping">
      <img src="/icon-alertmanager.png" alt="Alertmanager" class="tile-icon-overlap tile-icon-first" />
      <img src="/icon-grafana.png" alt="Grafana" class="tile-icon-overlap tile-icon-second" />
    </div>
  </div>

  <div class="tile tile-feature tile-w1">
    <div class="tile-feature-text">
      <h3 class="tile-feature-title">Multiple messengers support</h3>
      <p class="tile-feature-description">Slack, Mattermost, Telegram</p>
    </div>
    <div class="tile-feature-icons-overlapping">
      <img src="/icon-slack.png" alt="Slack" class="tile-icon-overlap tile-icon-first" />
      <img src="/icon-mattermost.png" alt="Mattermost" class="tile-icon-overlap tile-icon-second" />
      <img src="/icon-telegram.png" alt="Telegram" class="tile-icon-overlap tile-icon-third" />
    </div>
  </div>

  <div class="tile tile-feature tile-w2 tile-feature-with-image">
    <div class="tile-feature-text">
      <h3 class="tile-feature-title">UI</h3>
      <p class="tile-feature-description">Simple but highly customizable UI with data highlight</p>
    </div>
    <div class="tile-feature-image">
      <img src="/tile-ui-colors.png" alt="UI Colors" />
    </div>
  </div>
  <!-- 2 row -->
  <div class="tile tile-feature tile-w1">
    <div class="tile-feature-text">
      <h3 class="tile-feature-title">Inhibition rules</h3>
      <p class="tile-feature-description"><a href="https://docs.impulse.bot/features/suppression/" class="brand-color">Suppress</a> child incidents when a parent incident is active</p>
    </div>
    <div class="tile-feature-icon"><div class="tile-circle"></div></div>
  </div>

  <div class="tile tile-feature tile-w2 tile-feature-with-image">
    <div class="tile-feature-text">
      <h3 class="tile-feature-title">Snoozed incidents</h3>
      <p class="tile-feature-description"><a href="https://docs.impulse.bot/features/snoozed-incidents/" class="brand-color">Freeze</a> incidents to handle them later</p>
    </div>
    <div class="tile-feature-image">
      <img src="/tile-freeze.png" alt="Snoozed incidents" />
    </div>
  </div>

  <div class="tile tile-feature tile-w1">
    <div class="tile-feature-text">
      <h3 class="tile-feature-title">Task management integration</h3>
      <p class="tile-feature-description">Create <a href="https://docs.impulse.bot/integrations/jira/" class="brand-color">Jira</a> tasks directly from messenger</p>
    </div>
    <div class="tile-feature-icon"><div class="tile-circle"></div></div>
  </div>
  <!-- 3 row -->
  <div class="tile tile-feature tile-w1">
    <div class="tile-feature-text">
      <h3 class="tile-feature-title">No incident chaos</h3>
      <p class="tile-feature-description">Incidents have a <a href="https://docs.impulse.bot/stable/concepts/incident/#lifecycle" class="brand-color">lifecycle</a> that automatically prevents duplicate incidents and reduces noise</p>
    </div>
    <div class="tile-feature-icon"><div class="tile-circle"></div></div>
  </div>

  <div class="tile tile-feature tile-w1">
    <div class="tile-feature-text">
      <h3 class="tile-feature-title">External integrations</h3>
      <p class="tile-feature-description">Powerful <a href="https://docs.impulse.bot/stable/config_file/#webhooks" class="brand-color">webhooks</a> to integrate with any system</p>
    </div>
    <div class="tile-feature-icon"><div class="tile-circle"></div></div>
  </div>

  <div class="tile tile-feature tile-w2 tile-feature-with-image">
    <div class="tile-feature-text">
      <h3 class="tile-feature-title">Unlimited escalation policies</h3>
      <p class="tile-feature-description">Create as many <a href="https://docs.impulse.bot/configuration/escalation/" class="brand-color">escalation policies</a> as you need</p>
    </div>
    <div class="tile-feature-image">
      <img src="/tile-chains.png" alt="Unlimited escalation policies" />
    </div>
  </div>
  <!-- 4 row -->
  <div class="tile tile-feature tile-w2 tile-feature-with-image">
    <div class="tile-feature-text">
      <h3 class="tile-feature-title">High customization</h3>
      <p class="tile-feature-description">Powerful <a href="https://docs.impulse.bot/configuration/templates/" class="brand-color">Jinja2 templates</a> to customize incident messages</p>
    </div>
    <div class="tile-feature-image">
      <img src="/tile-templates.png" alt="High customization" />
    </div>
  </div>

  <div class="tile tile-feature tile-w1">
    <div class="tile-feature-text">
      <h3 class="tile-feature-title">Calendar integration</h3>
      <p class="tile-feature-description">Modify scheduling rotations right from your <a href="https://docs.impulse.bot/configuration/oncall/#google-calendar" class="brand-color">Google Calendar</a></p>
    </div>
  </div>

  <div class="tile tile-feature tile-w1">
    <div class="tile-feature-text">
      <h3 class="tile-feature-title">Multiple instances</h3>
      <p class="tile-feature-description">Run multiple IMPulse instances to provide high availability</p>
    </div>
    <div class="tile-feature-icon"><div class="tile-circle"></div></div>
  </div>
</div>

