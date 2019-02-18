<?php

namespace App\Http\Controllers;

use Overtrue\Socialite\User as SocialiteUser;
use Socialite;

class WechatController extends Controller
{
    public function oauth($code)
    {
        try {
            $accessToken = Socialite::driver('wechat')->getAccessToken($code);
            $user        = Socialite::driver('wechat')->user($accessToken);

            return $user;
        } catch (\Exception $e) {
            return abort(401, $e->getMessage());
        }
    }

    public function oauthMock()
    {
        if (env('APP_ENV') !== 'local') {
            abort(401, 'Only available when APP_ENV=local');
        }

        $original = [
            'openid'     => env('MOCK_WECHAT_OPENID'),
            'unionid'    => null,
            'nickname'   => env('MOCK_WECHAT_NICKNAME'),
            'headimgurl' => env('MOCK_WECHAT_HEADIMGURL'),
            'sex'        => 1,
            'language'   => 'zh_CN',
            'city'       => '潮州',
            'province'   => '广东',
            'country'    => '中国',
            'privilege'  => [],
        ];

        $socialiteUser = (new SocialiteUser([
            'id'       => array_get($original, 'openid'),
            'name'     => array_get($original, 'nickname'),
            'nickname' => array_get($original, 'nickname'),
            'avatar'   => array_get($original, 'headimgurl'),
            'email'    => null,
        ]))->merge(['original' => $original])->setProviderName('WeChat');


        return $socialiteUser;
    }

    public function jssdk()
    {
        $url       = request('url');
        $jsApiList = request('jsApiList');
        $jssdk     = app('wechat.official_account')->jssdk;
        $jssdk->setUrl($url);

        return $jssdk->buildConfig($jsApiList);
    }
}
