require "json"
version = JSON.parse(File.read("../package.json"))["version"]

Pod::Spec.new do |s|
  s.name           = "StoreReview"
  s.version        = version
  s.summary        = "App Store Ratings for React Native."
  s.homepage       = "https://github.com/rizzomichaelg/react-native-rating-requestor"
  s.license        = "MIT"
  s.author         = "Mike Rizzo"
  s.platform       = :ios, "7.0"
  s.source         = { :git => "https://github.com/rizzomichaelg/react-native-rating-requestor.git", :tag => "v#{s.version}" }
  s.source_files   = "*.{h,m}"
  s.preserve_paths = "**/*.js"
  s.requires_arc = true

  s.dependency "React"

end


