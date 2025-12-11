# Development Guidelines

**Critical**: This is an advocacy site providing talking points and educational content. Factual accuracy and proper sourcing are essential for credibility and effectiveness.

## Accuracy Standards

### Verified Sources Required

**NEVER assume factual data or make unsourced claims.** Always use verified, authoritative sources.

#### Preferred Sources (in order of preference):

1. **Federal .gov sites (most authoritative)**
   - congress.gov - Bill text, status, votes, sponsors
   - dc.gov / dccouncil.gov - DC government actions and laws
   - census.gov - Population and demographic data
   - irs.gov / treasury.gov - Tax data
   - dot.gov / ddot.dc.gov - Transportation and safety data
   - Other federal and DC .gov sites for domain-specific data

2. **Authoritative research and advocacy organizations**
   - IIHS (Insurance Institute for Highway Safety) - Traffic safety data
   - GHSA (Governors Highway Safety Association) - Pedestrian fatality data
   - DCFPI (DC Fiscal Policy Institute) - DC budget and tax analysis
   - Guttmacher Institute - Reproductive health policy data
   - Ballotpedia - Electoral and legislative information

3. **Credible news sources with original reporting**
   - DCist, Washington Post, etc. - For DC-specific stories
   - State/local news for district-level information
   - Must have verifiable facts, not opinion pieces

4. **Existing project data**
   - talkingPoints.js - Verified talking points with sources
   - categoryDetails.js - Validated category descriptions
   - talking-points-framing-guide.md - Reference document

### Source Citation Requirements

**All factual claims in talking points MUST include inline citations:**

✅ **DO**: Use inline markdown links in full arguments
```javascript
"cameras [reduce fatal crashes by 30%](https://www.iihs.org/news/detail/...)"
```

❌ **DON'T**: Make statistical claims without sources
```javascript
"cameras reduce fatal crashes by 30%" // No source!
```

**Citation Format:**
- Inline markdown links: `[claim](source URL)`
- Use authoritative source URLs (prefer .gov, .org, .edu)
- Link to specific studies/reports, not just home pages
- Include publication dates in hypocrisy research examples

### When to Ask Before Implementing

**ALWAYS check with the user when:**
- Making factual claims without a verified source
- Uncertain about statistical accuracy
- Choosing between multiple framing approaches
- Adding new category descriptions
- Making claims about congressional actions or votes
- Using historical comparisons or references
- Attributing positions to sponsors or organizations

**Examples requiring verification:**
- Vote counts and dates
- Statistical claims (percentages, totals, rates)
- Bill status and procedural stage
- Sponsor positions and statements
- District-level data (demographics, policies)
- Historical events and timelines
- State/local law provisions

### Messaging Accuracy vs. Tone

**Factual claims**: Must be sourced and accurate
**Framing/tone**: Can vary by audience (allies vs persuadables)

✅ Accurate messaging:
- **Fact**: "Pennsylvania permits red light cameras" [source]
- **Ally framing**: "Rep. Perry's hypocrisy is stunning"
- **Persuadable framing**: "This inconsistency contradicts conservative principles"

❌ Inaccurate messaging:
- **Wrong fact**: "Pennsylvania bans red light cameras" (provably false)
- **Unsupported claim**: "cameras reduce crashes by 80%" (no source)

### Hypocrisy Research Standards

When researching sponsor hypocrisy:

1. **Verify sponsor's bills** - Use bills.json or congress.gov
2. **Research their state/district** - Use Ballotpedia for district info
3. **Verify state laws** - Use state .gov sites or authoritative legal sources
4. **Document contradictions** - Show specific differences with sources
5. **Cite all claims** - Include inline links to sources

**Example structure:**
```javascript
{
  point: "Rep X blocks DC policy Y while their state allows Y",
  examples: "Rep X sponsors [Bill A](congress.gov link). Yet [State law allows Y](state.gov link), and [City uses Y](city source)."
}
```

## Data Validation Process

Before deploying talking points or content:

1. **Verify all factual claims** - Check against authoritative sources
2. **Add inline citations** - Link to source URLs
3. **Cross-reference dates** - Ensure timeline accuracy
4. **Test links** - Verify URLs work and go to correct content
5. **Check consistency** - Align with existing talking points tone
6. **Validate audience framing** - Ensure ally vs persuadable distinctions are clear

## Content Integrity

### Talking Points
- Full arguments require inline source citations
- Statistics need authoritative sources (.gov or research orgs)
- Hypocrisy research must cite specific contradictions
- Update reference guide with new research patterns

### Category Descriptions
- Historical claims require verification
- Bill references should match bills.json
- Dates and procedural details must be accurate
- Use specific examples with dates/numbers when possible

### Framing Guide
- Maintain clear audience distinctions
- Examples should reflect actual talking points
- Strategic notes based on evidence/feedback
- Document source patterns for future research

## Avoiding Common Errors

❌ **DON'T**:
- Assume state laws without verification
- Use first 2 letters for state abbreviations
- Make statistical claims without sources
- Infer bill status from limited information
- Copy unverified claims from news headlines

✅ **DO**:
- Check official state .gov sites for law verification
- Use official USPS state codes
- Link to studies/reports for all statistics
- Verify bill status on congress.gov
- Find primary sources for factual claims

## This Document

This file will be expanded over time with additional guidelines for:
- Content review process
- Audience testing standards
- Analytics interpretation
- Source quality evaluation
- Messaging effectiveness criteria

**Last Updated**: December 2025
