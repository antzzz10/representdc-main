// Inline citation link. Every stated fact on a sourced page should point at the
// specific page holding the supporting figure, not an organization's homepage.
const Cite = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
)

export default Cite
