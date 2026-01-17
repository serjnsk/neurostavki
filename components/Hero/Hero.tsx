'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import styles from './Hero.module.css'

interface LandingContent {
    titleText: string
    titleFont: string
    titleSize: string
    titleWeight: string
    leftText: string
    leftFont: string
    leftSize: string
    leftWeight: string
    buttonText: string
    buttonLink: string
    buttonFont: string
    buttonSize: string
    buttonWeight: string
    imageUrl: string
    bottomTitle: string
    bottomTitleFont: string
    bottomTitleSize: string
    bottomTitleWeight: string
    bottomText: string
    bottomTextFont: string
    bottomTextSize: string
    bottomTextWeight: string
}

interface HeroProps {
    content: LandingContent
}

export default function Hero({ content }: HeroProps) {
    // Parse left text to separate paragraphs from list items
    const lines = content.leftText.split('\n')
    const paragraphs: string[] = []
    const listItems: string[] = []

    lines.forEach(line => {
        if (line.startsWith('✓') || line.startsWith('•') || line.startsWith('-')) {
            listItems.push(line.replace(/^[✓•-]\s*/, ''))
        } else if (line.trim()) {
            paragraphs.push(line)
        }
    })

    // Parse text with markdown-style links [text](url)
    const parseTextWithLinks = (text: string) => {
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
        const parts: React.ReactNode[] = []
        let lastIndex = 0
        let match

        while ((match = linkRegex.exec(text)) !== null) {
            // Add text before the link
            if (match.index > lastIndex) {
                parts.push(text.slice(lastIndex, match.index))
            }
            // Add the link with gradient style
            parts.push(
                <a
                    key={match.index}
                    href={match[2]}
                    className={styles.gradientLink}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {match[1]}
                </a>
            )
            lastIndex = match.index + match[0].length
        }
        // Add remaining text after last link
        if (lastIndex < text.length) {
            parts.push(text.slice(lastIndex))
        }
        return parts.length > 0 ? parts : text
    }

    return (
        <section className={styles.hero}>
            <div className={`container ${styles.heroContainer}`}>
                {/* Main content area */}
                <div className={styles.mainContent}>
                    <div className={styles.leftColumn}>
                        {/* Title */}
                        <h1
                            className={styles.title}
                            style={{
                                fontFamily: content.titleFont,
                                fontSize: content.titleSize,
                                fontWeight: content.titleWeight
                            }}
                        >
                            {content.titleText.split(' ').map((word, i) => {
                                // Apply gradient to key words (2nd and 3rd word typically)
                                if (i === 1 || i === 2) {
                                    return <span key={i} className={styles.gradientText}>{word} </span>
                                }
                                return word + ' '
                            })}
                        </h1>

                        {/* Left text paragraphs */}
                        <div
                            className={styles.description}
                            style={{
                                fontFamily: content.leftFont,
                                fontSize: content.leftSize,
                                fontWeight: content.leftWeight
                            }}
                        >
                            {paragraphs.map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>

                        {/* List items */}
                        {listItems.length > 0 && (
                            <ul className={styles.featureList}>
                                {listItems.map((item, i) => (
                                    <li
                                        key={i}
                                        style={{
                                            fontFamily: content.leftFont,
                                            fontWeight: '600'
                                        }}
                                    >
                                        <span className={styles.checkmark}>✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Button */}
                        <a
                            href={content.buttonLink}
                            className={styles.ctaButton}
                            style={{
                                fontFamily: content.buttonFont,
                                fontSize: content.buttonSize,
                                fontWeight: content.buttonWeight
                            }}
                        >
                            {content.buttonText}
                            <ArrowRight size={20} />
                        </a>
                    </div>

                    {/* Right column - Image */}
                    <div className={styles.rightColumn}>
                        <Image
                            src={content.imageUrl}
                            alt="Hero image"
                            width={550}
                            height={550}
                            className={styles.heroImage}
                            priority
                        />
                    </div>
                </div>

                {/* Bottom section */}
                <div className={styles.bottomSection}>
                    <h2
                        className={styles.bottomTitle}
                        style={{
                            fontFamily: content.bottomTitleFont,
                            fontSize: content.bottomTitleSize,
                            fontWeight: content.bottomTitleWeight
                        }}
                    >
                        {parseTextWithLinks(content.bottomTitle)}
                    </h2>
                    <p
                        className={styles.bottomText}
                        style={{
                            fontFamily: content.bottomTextFont,
                            fontSize: content.bottomTextSize,
                            fontWeight: content.bottomTextWeight
                        }}
                    >
                        {parseTextWithLinks(content.bottomText)}
                    </p>
                </div>
            </div>
        </section>
    )
}
