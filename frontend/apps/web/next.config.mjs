/** @type {import('next').NextConfig} */
const nextConfig = {
  // Os pacotes @friocerto/* são publicados como TypeScript/TSX puro dentro do monorepo.
  transpilePackages: ['@friocerto/ui', '@friocerto/theme', '@friocerto/icons', '@friocerto/modules'],
  // Gera um servidor enxuto para a imagem Docker no Easypanel.
  output: 'standalone',
};

export default nextConfig;
