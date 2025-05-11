/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        // Add a rule for handling .node files
        config.module.rules.push({
          test: /\.node$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            publicPath: `/_next/static/chunks/${isServer ? 'server/' : ''}media/`,
            outputPath: `${isServer ? '../' : ''}static/chunks/${isServer ? 'server/' : ''}media/`,
          },
        });
    
        return config;
      },
}

module.exports = nextConfig
