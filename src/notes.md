# What is the purpose of the allowlist?

It's a whitelist of domains

> Safe Browsing is a Google service that lets client applications check URLs against Google's constantly updated lists of unsafe web resources. Examples of unsafe web resources are social engineering sites (phishing and deceptive sites) and sites that host malware or unwanted software.

https://github.com/mozilla-services/shavar

Okay, so this is about stopping info on site A, being leaked to site B

> Tracking protection technically works by blocking loads from blocked domains. But the Entity List conceptually changes it, so that it is no longer about domains, but about the companies. If you are visiting a website, engaged 1-on-1 with them, Tracking Protection will block the other companies who the user may not realize are even present and didn't explicitly intend to interact with.

This first/third party thing list is what

## How the graph works

On load we generate the nodes, a bunch of circles for 1st part, and triangles for 3rd party

Next we draw the links between the sites. The list of links is passed in

We generate nodes and linkes with `transformData()` in lightbeam.js.
