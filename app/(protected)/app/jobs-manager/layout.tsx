export default function JobsLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <section>
            <div>
                {children}
            </div>
        </section>
    )
  }