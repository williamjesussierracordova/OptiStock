import {  Instagram, Linkedin, Github, Mail } from 'lucide-react'
interface FooterSection {
    title: string
    vinculo: string
    items: string[]
}

const Footer = () => {
    const footerSections: FooterSection[] = [
        {
            title: 'Utilidades',
            vinculo: '/analisis',
            items: [
                'Detección de virus',
                'Estadísticas de ADN',
                'Descarga de resultados'
            ]
        },
        {
            title: 'Documentos',
            vinculo: '/documentacion',
            items: [
                'Documentación de uso',
                'Documentación de flujo'
            ]
        },
        {
            title: 'Contacto',
            vinculo: '/contact',
            items: [
                'Contacto',
            ]
        }
    ]

    return(
        <footer className="w-full border-t py-12 px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Social Icons */}
                    <div className="space-y-4">
                        <div className="text-2xl font-bold mb-4">
                            <a href='/home'>
                                <img src='/chartLineBlack.svg' alt="Logo" className="h-8 " />
                            </a>
                        </div>
                        <div className="flex space-x-4">
                            <a href="https://github.com/williamjesussierracordova/classification_viruses" 
                            target='_blank'
                            className="text-muted-foreground hover:text-foreground">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="https://www.instagram.com/_williamjsc_/" 
                            target='_blank'
                            className="text-muted-foreground hover:text-foreground">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="https://www.linkedin.com/in/william-jesus-sierra-cordova-65580128a/" 
                            target='_blank'
                            className="text-muted-foreground hover:text-foreground">
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href="mailto:williamjsc@hotmail.com" 
                            className="text-muted-foreground hover:text-foreground">
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Footer Sections */}
                    {footerSections.map((section) => (
                        <div key={section.title} className='flex flex-col items-start '>
                            <h2 className="font-semibold mb-4">{section.title}</h2>
                            <ul className="space-y-2 flex flex-col items-start ">
                                {section.items.map((item) => (
                                    <li key={item}>
                                        <a href={section.vinculo}  className="text-muted-foreground hover:text-foreground">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </footer>
    )
}

export default Footer

