<?php


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::get('oauth/{code}', 'WechatController@oauth');
Route::get('oauth-mock', 'WechatController@oauthMock');
Route::post('jssdk', 'WechatController@jssdk');
