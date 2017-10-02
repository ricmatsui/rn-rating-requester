#import "StoreReview.h"
#import <StoreKit/SKStoreReviewController.h>

@implementation StoreReview

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE()

- (NSDictionary *)constantsToExport
{
  return @{
    @"SKStoreReviewAvailable": [SKStoreReviewController class] ? @(YES) : @(NO)
  };
}

RCT_EXPORT_METHOD(requestReview)
{
  [SKStoreReviewController requestReview];
}

@end
