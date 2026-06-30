import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
  robots?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title = 'Pigglitz - 3D Printing Pitara', 
  description = 'Welcome to Pigglitz, your 3D Printing Pitara! Discover magical, colorful, and fun 3D printed toys made just for you!',
  keywords = '3D printed toys, personalized gifts, Pigglitz, toy, fun toys, kids toys',
  url = 'https://pigglitz.com/',
  image = 'https://pigglitz.com/logo.png', // Adjust default image as needed
  robots = 'index, follow'
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robots} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
