require 'digest/md5'
require 'logger'

log = Logger.new(STDOUT)
log.info "Starting my watch"

sass_digest = Digest::MD5.hexdigest(File.read('./src/app.sass'))
jsx_digest = Digest::MD5.hexdigest(File.read('./src/app.jsx'))
html_digest = Digest::MD5.hexdigest(File.read('./src/index.html'))

loop do
    new_sass_digest = Digest::MD5.hexdigest(File.read('./src/app.sass'))
    if new_sass_digest != sass_digest
        log.info "Building sass"
        Kernel.system('sass', './src/app.sass', './lib/app.css')
        sass_digest = new_sass_digest
    end

    new_jsx_digest = Digest::MD5.hexdigest(File.read('./src/app.jsx'))
    if new_jsx_digest != jsx_digest
        log.info "Building jsx"
        Kernel.system('babel', 'src', '-d lib')
        jsx_digest = new_jsx_digest
    end

    new_html_digest = Digest::MD5.hexdigest(File.read('./src/index.html'))
    if new_html_digest != html_digest
        log.info "Copying html"
        Kernel.system('copy', '/Y', 'src\index.html', 'lib\index.html')
        html_digest = new_html_digest
    end

    sleep(0.2)
end
