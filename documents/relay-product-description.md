# <p align="center">The Grapevine Relay</p>

## Alternate names

* the Grapevine Relay, the Tapestry Relay, the Brainstorm Relay,

* may rebrand the Influence Score: the Brainstorm WoT Score, the Grapevine WoT Score, the Tapestry WoT Score

## Product Description

The Grapevine allows you and your community to identify who is the most trustworthy, and in what context, to curate content, facts and information.

Customers will include everyday users as well as businesses that are part of the nostr ecosystem.

## How it works

The Grapevine monitors nostr continuously and uses specialized algorithms to calculate contextual Grapevine web of trust scores. These scores are made availalbe to nostr clients who use them to customize your experience.

## What information does the Grapevine harness to calculate Grapevine WoT Scores

Currently: 
- likes, zaps, reactions
- Grapevine endorsements

Actively developing new sources of data. Such as explicit trust attestations. Which will augment the above data sources, not replace them.

## How will I sign up

You will be able to go to our website and enter your npub. That's all it will take. We will also work with popular nostr clients to facilitate the onboarding process, often at the click of just one button.

## How much does it cost

Similar to `nostr.build`, there will be a free tier and subscription tiers. 

Free tier will provide standard Grapevine WoT Scores and will update them once a day. 

Subscription tiers will provide additional services:

## Who is this service for?

### relay operators
- filter out spam

### Lightning node operators
- Identify other lghtning nodes that you may want to connect to -- and those you should avoid

### everyday nostr users
- example 1
- example 2

## Prototype

brainstorm.ninja:
- calculate Grapevine WoT Scores from follows and mutes
To Do:
- incorporate zaps

Tech stack includes:
- NDK
- React
- nostr-hooks
- coreUI

Expertise in the following:
- DVM
- nostr relay management

## How is this different than all previous attempts at WoT

developed by a neuroscientist to mirror how trust is calculated in the brain. The main difference is that your computer can keep track of the reputations of billions of people in hundreds of contexts -- many more than you can do in your head.

## How is this not a social credit score

It's decentralized. Social credit scores are centralized. The only single point of control is YOU, because YOU are always at the center of YOUR Grapevine.

Bitcoin does not equal fiat. Likewise, the Grapevine does not equal the CCP social credit scoring system. 

## Tech specs

nostr relay + DVM + web of trust (+ integrated lightning wallet?)

The Grapevine Relay is an open source personal nostr relay that harnesses web of trust to improve every aspect of your nostr experience. 

First, your Grapevine Relay is a personal archive of any and every piece of nostr content that you deem to be worth keeping. That includes follows, zaps, likes, and any other data used to calculate web of trust scores. 

Second, the relay calculates web of trust scores according to the principles of the Tapestry protocol and uses them:
- It makes those scores readily available to nostr clients so that they can stratify content
- Those scores help you decide which content is worth archiving and which is not
- Those scores can be used to help you decide which npubs should and should not have access to your content

## Monetization

Most users lack the technical skill and / or the motivation to manage their own personal relay. To serve the needs of the majority of nostr users, PGFT will provide a streamlined and easy to use service.

### Free tier

The free tier will keep track of the generic Influence Score plus perhaps a handful of contextual Influence Scores. To sign up to the free tier service will require a request in the form of a specialized note and may require proof of work to minimize spam. 

Features included in the free tier service may include:
- Grapevine Channels, viewable on Coracle and other clients
- Grapevine Curated Lists
- Badges: ability to view; creating new badges may (eventually) require a subscription service.

### Subscription tiers

Subscriptions will allow users to augment free tier services in the following ways:
- ability to track more contextual influence scores
- control panels to fine tune how each influence score is calculated
- more storage
- additional API options
- more frequent score updates

### Customer onboarding

Clients such as Coracle will prompt users following more than one but fewer than some low cutoff (perhaps 10 npubs) to sign up to the Free Service and use the Grapevine Feed. This prompt will employ proof of work at signup to reduce the risk of spam. New users who go to product website will also see the most populat Grapevine Channels appear.

## Customers

Customers will be any nostr user with an npub. (Note this can be regular plebs as well as businesses.)

## Client partnerships

Nostr clients across the ecosystem will have free access to Grapevine Scores to improve their overall user experience. Clients will use these scores to deliver personalized and customizable content stratification and content discovery.

(Hope to pioneer grapevine-client integration through Coracle.)

## Grapevine Relay as a DVM

## Control Panel

## Badges

Badges are descriptors applied to npubs. Users can self-attest or can attest to others. Examples of badges may include personal identifying information such as age or place of residence. 

Npubs can be endorsed as oracles for badges.

The Concept Graph system will be used to create and manage the system of badges. 

