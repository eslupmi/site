---
title: Quick Start
description: Start IMPulse with Docker Compose and the built-in web UI.
---
{{< raw >}}
<div class="quick-start">
<!-- QUICKSTART -->
<p>The following steps will start IMPulse using Docker Compose with the built-in web UI, without integrating a chat messenger.</p>
<div class="highlight"><pre><code><span class="c1"># Create directory structure</span>
mkdir -p impulse/{config,data} &amp;&amp; cd impulse

<span class="c1"># Get Docker compose file and configuration example</span>
curl -fsSL -o docker-compose.yml https://raw.githubusercontent.com/eslupmi/impulse/develop/examples/docker-compose.none.yml
curl -fsSL -o config/impulse.yml https://raw.githubusercontent.com/eslupmi/impulse/develop/examples/impulse.none.yml

<span class="c1"># Run IMPulse</span>
docker compose up -d</code></pre></div>
<p>Now IMPulse is available at <a href="http://localhost:5000/" class="brand-color">http://localhost:5000/</a>.</p>
<h3>Test alert</h3>
<p>You can try to send a test alert with:</p>
<div class="highlight"><pre><code>curl -XPOST -H &quot;Content-Type: application/json&quot; http://localhost:5000/ -d &#x27;{&quot;receiver&quot;:&quot;webhook-alerts&quot;,&quot;status&quot;:&quot;firing&quot;,&quot;alerts&quot;:[{&quot;status&quot;:&quot;firing&quot;,&quot;labels&quot;:{&quot;alertname&quot;:&quot;InstanceDown4&quot;,&quot;instance&quot;:&quot;localhost:9100&quot;,&quot;job&quot;:&quot;node&quot;,&quot;severity&quot;:&quot;warning&quot;},&quot;annotations&quot;:{&quot;summary&quot;:&quot;Instanceunavailable&quot;},&quot;startsAt&quot;:&quot;2024-07-28T19:26:43.604Z&quot;,&quot;endsAt&quot;:&quot;0001-01-01T00:00:00Z&quot;,&quot;generatorURL&quot;:&quot;http://eva:9090/graph?g0.expr=up+%3D%3D+0&amp;g0.tab=1&quot;,&quot;fingerprint&quot;:&quot;a7ddb1de342424cb&quot;}],&quot;groupLabels&quot;:{&quot;alertname&quot;:&quot;InstanceDown&quot;},&quot;commonLabels&quot;:{&quot;alertname&quot;:&quot;InstanceDown&quot;,&quot;instance&quot;:&quot;localhost:9100&quot;,&quot;job&quot;:&quot;node&quot;,&quot;severity&quot;:&quot;warning&quot;},&quot;commonAnnotations&quot;:{&quot;summary&quot;:&quot;Instanceunavailable&quot;},&quot;externalURL&quot;:&quot;http://eva:9093&quot;,&quot;version&quot;:&quot;4&quot;,&quot;groupKey&quot;:&quot;{}:{alertname=\&quot;InstanceDown\&quot;}&quot;,&quot;truncatedAlerts&quot;:0}&#x27;</code></pre></div>
<p>The new <code>firing</code> incident appears in the UI.</p>
<p>Follow the <a href="/docs/stable/installation/" class="brand-color">installation guide</a> for production deployment.</p>
<!-- /QUICKSTART -->
</div>
{{< /raw >}}
