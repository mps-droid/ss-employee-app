#import "AppDelegate.h"

#import <Firebase.h>

// The app uses the UIScene life cycle, which the iOS 27 SDK requires.
// React Native is started by SceneDelegate, declared in Info.plist.
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Firebase reads ios/GoogleService-Info.plist, which is kept out of git.
  [FIRApp configure];

  return YES;
}

@end
