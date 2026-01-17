'use client'

import { useEffect, useState, useRef } from 'react'
import { Save, Upload, RefreshCw } from 'lucide-react'
import Image from 'next/image'
import styles from './content.module.css'

interface LandingContent {
    id?: number
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

const FONTS = [
    'Poppins',
    'Inter',
    'Roboto',
    'Open Sans',
    'Montserrat',
    'Nunito',
    'Rubik'
]

const WEIGHTS = ['400', '500', '600', '700', '800']

const SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '40px', '45px', '48px', '56px']

const defaultContent: LandingContent = {
    titleText: 'Ежедневные прогнозы на спорт от нейросети',
    titleFont: 'Poppins',
    titleSize: '45px',
    titleWeight: '800',
    leftText: 'НейроСтавки анализирует тысячи матчей.\n✓ 3 прогноза в день\n✓ 87% точность\n✓ 3000+ пользователей',
    leftFont: 'Poppins',
    leftSize: '16px',
    leftWeight: '400',
    buttonText: 'Получить прогноз',
    buttonLink: '#',
    buttonFont: 'Poppins',
    buttonSize: '20px',
    buttonWeight: '700',
    imageUrl: '/hero-collage.png',
    bottomTitle: 'ИИ обучен на анализе 30 088 матчей',
    bottomTitleFont: 'Poppins',
    bottomTitleSize: '24px',
    bottomTitleWeight: '700',
    bottomText: 'Построен на TensorFlow, ChatGPT 5.0 и Keras.io',
    bottomTextFont: 'Poppins',
    bottomTextSize: '14px',
    bottomTextWeight: '400'
}

export default function ContentPage() {
    const [content, setContent] = useState<LandingContent>(defaultContent)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetchContent()
    }, [])

    const fetchContent = async () => {
        setIsLoading(true)
        const token = localStorage.getItem('adminToken')

        try {
            const res = await fetch('/api/admin/content', {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.ok) {
                const data = await res.json()
                setContent(data)
            }
        } catch (error) {
            console.error('Failed to fetch content:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        setMessage({ type: '', text: '' })

        try {
            const token = localStorage.getItem('adminToken')

            const res = await fetch('/api/admin/content', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(content)
            })

            if (res.ok) {
                setMessage({ type: 'success', text: 'Сохранено!' })
            } else {
                throw new Error('Failed to save')
            }
        } catch {
            setMessage({ type: 'error', text: 'Ошибка сохранения' })
        } finally {
            setIsSaving(false)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const token = localStorage.getItem('adminToken')
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            })

            if (res.ok) {
                const data = await res.json()
                setContent({ ...content, imageUrl: data.url })
                setMessage({ type: 'success', text: 'Изображение загружено!' })
            } else {
                throw new Error('Upload failed')
            }
        } catch {
            setMessage({ type: 'error', text: 'Ошибка загрузки' })
        } finally {
            setIsUploading(false)
        }
    }

    const updateField = (field: keyof LandingContent, value: string) => {
        setContent({ ...content, [field]: value })
    }

    if (isLoading) {
        return <div className={styles.loading}>Загрузка...</div>
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Редактор контента</h1>
                <div className={styles.actions}>
                    <button onClick={fetchContent} className={styles.refreshBtn}>
                        <RefreshCw size={16} />
                    </button>
                    <button onClick={handleSave} disabled={isSaving} className={styles.saveBtn}>
                        <Save size={16} />
                        {isSaving ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </div>
            </div>

            {message.text && (
                <div className={`${styles.message} ${styles[message.type]}`}>
                    {message.text}
                </div>
            )}

            <div className={styles.sections}>
                {/* 1. Title */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>1. Заголовок</h2>
                    <div className={styles.field}>
                        <label>Текст</label>
                        <input
                            type="text"
                            value={content.titleText}
                            onChange={(e) => updateField('titleText', e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.fontSettings}>
                        <div className={styles.fontField}>
                            <label>Шрифт</label>
                            <select value={content.titleFont} onChange={(e) => updateField('titleFont', e.target.value)} className={styles.select}>
                                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                        <div className={styles.fontField}>
                            <label>Размер</label>
                            <select value={content.titleSize} onChange={(e) => updateField('titleSize', e.target.value)} className={styles.select}>
                                {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className={styles.fontField}>
                            <label>Начертание</label>
                            <select value={content.titleWeight} onChange={(e) => updateField('titleWeight', e.target.value)} className={styles.select}>
                                {WEIGHTS.map(w => <option key={w} value={w}>{w}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. Left Text */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>2. Левый текст</h2>
                    <div className={styles.field}>
                        <label>Текст (используйте ✓ для списка)</label>
                        <textarea
                            value={content.leftText}
                            onChange={(e) => updateField('leftText', e.target.value)}
                            className={styles.textarea}
                            rows={6}
                        />
                    </div>
                    <div className={styles.fontSettings}>
                        <div className={styles.fontField}>
                            <label>Шрифт</label>
                            <select value={content.leftFont} onChange={(e) => updateField('leftFont', e.target.value)} className={styles.select}>
                                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                        <div className={styles.fontField}>
                            <label>Размер</label>
                            <select value={content.leftSize} onChange={(e) => updateField('leftSize', e.target.value)} className={styles.select}>
                                {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className={styles.fontField}>
                            <label>Начертание</label>
                            <select value={content.leftWeight} onChange={(e) => updateField('leftWeight', e.target.value)} className={styles.select}>
                                {WEIGHTS.map(w => <option key={w} value={w}>{w}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 3. Button */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>3. Кнопка</h2>
                    <div className={styles.fieldRow}>
                        <div className={styles.field}>
                            <label>Текст</label>
                            <input
                                type="text"
                                value={content.buttonText}
                                onChange={(e) => updateField('buttonText', e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Ссылка</label>
                            <input
                                type="text"
                                value={content.buttonLink}
                                onChange={(e) => updateField('buttonLink', e.target.value)}
                                className={styles.input}
                            />
                        </div>
                    </div>
                    <div className={styles.fontSettings}>
                        <div className={styles.fontField}>
                            <label>Шрифт</label>
                            <select value={content.buttonFont} onChange={(e) => updateField('buttonFont', e.target.value)} className={styles.select}>
                                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                        <div className={styles.fontField}>
                            <label>Размер</label>
                            <select value={content.buttonSize} onChange={(e) => updateField('buttonSize', e.target.value)} className={styles.select}>
                                {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className={styles.fontField}>
                            <label>Начертание</label>
                            <select value={content.buttonWeight} onChange={(e) => updateField('buttonWeight', e.target.value)} className={styles.select}>
                                {WEIGHTS.map(w => <option key={w} value={w}>{w}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 4. Image */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>4. Картинка справа</h2>
                    <div className={styles.imageUpload}>
                        <div className={styles.imagePreview}>
                            {content.imageUrl && (
                                <Image
                                    src={content.imageUrl}
                                    alt="Hero"
                                    width={200}
                                    height={200}
                                    style={{ objectFit: 'contain' }}
                                />
                            )}
                        </div>
                        <div className={styles.uploadActions}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className={styles.fileInput}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className={styles.uploadBtn}
                            >
                                <Upload size={16} />
                                {isUploading ? 'Загрузка...' : 'Загрузить'}
                            </button>
                            <span className={styles.imageUrl}>{content.imageUrl}</span>
                        </div>
                    </div>
                </div>

                {/* 5. Bottom Title */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>5. Подзаголовок снизу</h2>
                    <div className={styles.field}>
                        <label>Текст (для ссылок: [текст](url))</label>
                        <input
                            type="text"
                            value={content.bottomTitle}
                            onChange={(e) => updateField('bottomTitle', e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.fontSettings}>
                        <div className={styles.fontField}>
                            <label>Шрифт</label>
                            <select value={content.bottomTitleFont} onChange={(e) => updateField('bottomTitleFont', e.target.value)} className={styles.select}>
                                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                        <div className={styles.fontField}>
                            <label>Размер</label>
                            <select value={content.bottomTitleSize} onChange={(e) => updateField('bottomTitleSize', e.target.value)} className={styles.select}>
                                {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className={styles.fontField}>
                            <label>Начертание</label>
                            <select value={content.bottomTitleWeight} onChange={(e) => updateField('bottomTitleWeight', e.target.value)} className={styles.select}>
                                {WEIGHTS.map(w => <option key={w} value={w}>{w}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 6. Bottom Text */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>6. Нижний текст</h2>
                    <div className={styles.field}>
                        <label>Текст (для ссылок: [текст](url))</label>
                        <input
                            type="text"
                            value={content.bottomText}
                            onChange={(e) => updateField('bottomText', e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.fontSettings}>
                        <div className={styles.fontField}>
                            <label>Шрифт</label>
                            <select value={content.bottomTextFont} onChange={(e) => updateField('bottomTextFont', e.target.value)} className={styles.select}>
                                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                        <div className={styles.fontField}>
                            <label>Размер</label>
                            <select value={content.bottomTextSize} onChange={(e) => updateField('bottomTextSize', e.target.value)} className={styles.select}>
                                {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className={styles.fontField}>
                            <label>Начертание</label>
                            <select value={content.bottomTextWeight} onChange={(e) => updateField('bottomTextWeight', e.target.value)} className={styles.select}>
                                {WEIGHTS.map(w => <option key={w} value={w}>{w}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
