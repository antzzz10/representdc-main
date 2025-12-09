import { useState } from 'react'
import './TalkingPoints.css'

function TalkingPoints({ categoryId, talkingPoints }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeAudience, setActiveAudience] = useState('allies')
  const [copiedText, setCopiedText] = useState(null)

  if (!talkingPoints) {
    return null
  }

  // Convert markdown links [text](url) to HTML <a> tags
  const renderMarkdownLinks = (text) => {
    const html = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    return { __html: html }
  }

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(label)
      setTimeout(() => setCopiedText(null), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const shareOnSocialMedia = (text) => {
    // Generic share - uses Web Share API if available, otherwise copies to clipboard
    if (navigator.share) {
      navigator.share({
        text: text
      }).catch(err => {
        // If share fails, fall back to copy
        copyToClipboard(text, 'shared')
      })
    } else {
      // Fallback: just copy to clipboard
      copyToClipboard(text, 'shared')
    }
  }

  const currentPoints = talkingPoints[activeAudience]

  return (
    <div className="talking-points-container">
      <button
        className="talking-points-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        💬 Talking Points
      </button>

      {isOpen && (
        <div className="talking-points-modal">
          <div className="talking-points-content">
            <div className="talking-points-header">
              <h3>Talking Points</h3>
              <button
                className="talking-points-close"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="audience-tabs">
              <button
                className={`audience-tab ${activeAudience === 'allies' ? 'active' : ''}`}
                onClick={() => setActiveAudience('allies')}
              >
                For Allies
              </button>
              <button
                className={`audience-tab ${activeAudience === 'persuadable' ? 'active' : ''}`}
                onClick={() => setActiveAudience('persuadable')}
              >
                For Persuadables
              </button>
            </div>

            <div className="talking-points-list">
              <div className="talking-point-item">
                <div className="talking-point-header">
                  <h4>📱 One-Liner <span className="char-count">({currentPoints.oneLiner.length} chars)</span></h4>
                  <p className="usage-hint">Perfect for social media posts</p>
                </div>
                <p className="talking-point-text" dangerouslySetInnerHTML={renderMarkdownLinks(currentPoints.oneLiner)} />
                <div className="talking-point-actions">
                  <button
                    onClick={() => copyToClipboard(currentPoints.oneLiner, 'oneLiner')}
                    className="action-button"
                  >
                    {copiedText === 'oneLiner' ? '✓ Copied!' : '📋 Copy'}
                  </button>
                  <button
                    onClick={() => shareOnSocialMedia(currentPoints.oneLiner)}
                    className="action-button"
                  >
                    🔗 Share
                  </button>
                </div>
              </div>

              <div className="talking-point-item">
                <div className="talking-point-header">
                  <h4>🗣️ Elevator Pitch</h4>
                  <p className="usage-hint">For conversations and longer posts</p>
                </div>
                <p className="talking-point-text" dangerouslySetInnerHTML={renderMarkdownLinks(currentPoints.elevatorPitch)} />
                <div className="talking-point-actions">
                  <button
                    onClick={() => copyToClipboard(currentPoints.elevatorPitch, 'elevatorPitch')}
                    className="action-button"
                  >
                    {copiedText === 'elevatorPitch' ? '✓ Copied!' : '📋 Copy'}
                  </button>
                  <button
                    onClick={() => shareOnSocialMedia(currentPoints.elevatorPitch)}
                    className="action-button"
                  >
                    🔗 Share
                  </button>
                </div>
              </div>

              <div className="talking-point-item">
                <div className="talking-point-header">
                  <h4>📄 Full Argument</h4>
                  <p className="usage-hint">Detailed version with complete context</p>
                </div>
                <p className="talking-point-text" dangerouslySetInnerHTML={renderMarkdownLinks(currentPoints.fullArgument)} />
                <div className="talking-point-actions">
                  <button
                    onClick={() => copyToClipboard(currentPoints.fullArgument, 'fullArgument')}
                    className="action-button"
                  >
                    {copiedText === 'fullArgument' ? '✓ Copied!' : '📋 Copy'}
                  </button>
                </div>
              </div>

              {talkingPoints.hypocrisy && talkingPoints.hypocrisy.length > 0 && (
                <div className="hypocrisy-section">
                  <h4>🎯 Hypocrisy Points</h4>
                  <p className="hypocrisy-intro">Use these to counter opposition:</p>
                  {talkingPoints.hypocrisy.map((item, index) => (
                    <div key={index} className="hypocrisy-item">
                      <p className="hypocrisy-point" dangerouslySetInnerHTML={renderMarkdownLinks(item.point)} />
                      {item.examples && (
                        <p className="hypocrisy-examples"><em dangerouslySetInnerHTML={renderMarkdownLinks(item.examples)} /></p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TalkingPoints
