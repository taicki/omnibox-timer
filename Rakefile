task :default => ['package']

task :package do
  package_name = 'omnibox-timer.zip'
  File.delete(package_name) if File.exists?(package_name)
  Dir.chdir('src') do
    sh %{zip ../#{package_name} *}
  end
end
