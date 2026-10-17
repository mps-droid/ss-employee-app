#import "AppDelegate.h"
#import <Firebase.h>
#import <TargetConditionals.h>
#import <React/RCTBundleURLProvider.h>
#if __has_include(<GoogleMaps/GoogleMaps.h>)
#import <GoogleMaps/GoogleMaps.h>
#if __has_include(<react_native_config/RNCConfig.h>)
#import <react_native_config/RNCConfig.h>
#else
#import "RNCConfig.h"
#endif
#endif
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
   #if __has_include(<GoogleMaps/GoogleMaps.h>)
  [GMSServices provideAPIKey:[RNCConfig envFor:@"GOOGLE_MAPS_API_KEY_IOS"]];
#endif
 
    [FIRApp configure];
  
  self.moduleName = @"SocialEmployee";
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
  NSURL *embedded = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#if TARGET_OS_SIMULATOR
  NSURL *metroURL = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
  if (metroURL != nil) {
    return metroURL;
  }
  if (embedded != nil) {
    return embedded;
  }
  return metroURL;
#else
  if (embedded != nil) {
    return embedded;
  }

  NSString *ipPath = [[NSBundle mainBundle] pathForResource:@"ip" ofType:@"txt"];
  NSString *ip = nil;
  if (ipPath != nil) {
    ip = [[NSString stringWithContentsOfFile:ipPath
                                    encoding:NSUTF8StringEncoding
                                       error:nil]
        stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
  }

  NSString *packagerHost = nil;
  if (ip.length > 0) {
    packagerHost = [ip containsString:@":"] ? ip : [NSString stringWithFormat:@"%@:8081", ip];
  }

  if (packagerHost.length > 0) {
    NSURL *metroURL = [RCTBundleURLProvider jsBundleURLForBundleRoot:@"index"
                                                        packagerHost:packagerHost
                                                           enableDev:YES
                                                  enableMinification:NO
                                                     inlineSourceMap:NO];
    if (metroURL != nil) {
      return metroURL;
    }
  }

  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#endif
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
