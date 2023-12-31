var should = require('should');
var sinon = require('sinon');
var PhantAuthStrategy = require('passport-phantauth/strategy');

describe('PhantAuthStrategy', function() {
    var it_should_handle_errors = function() {
        it('should error', function(done) {
            strategy.userProfile('something', function(err, profile) {
                should.exist(err);
                done();
            });
        });

        it('should not load profile', function(done) {
            strategy.userProfile('something', function(err, profile) {
                should.not.exist(profile);
                done();
            });
        });
    };

    var strategy = new PhantAuthStrategy(
      {
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {}
    );

    it('should be named phantauth', function() {
        strategy.name.should.equal('phantauth');
    });

    it('should not request use of auth header for GET requests', function() {
        strategy._oauth2._useAuthorizationHeaderForGET.should.equal(false);
    });

    describe('scope', function() {
        it('should not specify scopes by default', function() {
            var scope = new PhantAuthStrategy(
              {
                clientID: 'ABC123',
                clientSecret: 'secret'
              },
              function() {}
            )._scope;
            should.not.exist(scope);
        });

        describe('array option', function() {
            var strategy,
                options = {
                  clientID: 'ABC123',
                  clientSecret: 'secret',
                  scope: ['one', 'two', 'five'],
                  showDialog: true
                };

            before(function() {
                strategy = new PhantAuthStrategy(options,
                  function() {}
                );
            });

            it('should enforce openid scope presence', function() {
               strategy._scope.should.containEql('one');
               strategy._scope.should.containEql('two');
               strategy._scope.should.containEql('five');
            });

            it('should enforce whitespace separator', function() {
                strategy._scopeSeparator.should.equal(' ');
            });

        });
    });

    describe('token endpoint interaction', function() {
        describe('authorization', function() {
            before(function() {
                sinon.stub(strategy._oauth2, '_request');
            });

            after(function() {
                strategy._oauth2._request.restore();
            });

            it('should authenticate using client id and client secret pair', function() {
                strategy._oauth2.getOAuthAccessToken('code', {}, undefined);

                function parseQueryString(query) {
                    var returnObject = {};
                    var vars = query.split('&');
                    vars.forEach(function(variable) {
                        var parts = variable.split('=');
                        returnObject[parts[0]] = parts[1];
                    });
                    return returnObject;
                }

                var data = {
                    code: 'code',
                    client_id: 'ABC123',
                    client_secret: 'secret'
                };

                data.should.eql(parseQueryString(strategy._oauth2._request.firstCall.args[3]));
            });
        });

        describe('on success', function() {
            before(function() {
                sinon.stub(strategy._oauth2, '_request').callsFake(function(method, url, headers, post_body, access_token, callback) {
                    headers.should.eql({
                        'Content-Type': 'application/x-www-form-urlencoded'
                    });
                    var data = JSON.stringify({
                        access_token: 'access_token',
                        refresh_token: 'refresh_token',
                        expires_in: 'expires_in',
                        client_id: 'ABC123',
                        client_secret: 'secret',
                        something_random: 'randomness'
                    });

                    callback(null, data, null);
                });
            });

            after(function() {
                strategy._oauth2._request.restore();
            });

            it('should pass the data back', function(done) {
                strategy._oauth2.getOAuthAccessToken('code', {}, function(err, accessToken, refreshToken, expires_in, params) {
                    should.not.exist(err);
                    accessToken.should.equal('access_token');
                    refreshToken.should.equal('refresh_token');
                    expires_in.should.equal('expires_in');
                    done();
                });
            });
        });

        describe('on error', function() {
            before(function() {
                sinon.stub(strategy._oauth2, '_request').callsFake(function(method, url, headers, post_body, access_token, callback) {
                    headers.should.eql({
                        'Content-Type': 'application/x-www-form-urlencoded'
                    });
                    callback('something bad has happened');
                });
            });

            after(function() {
                strategy._oauth2._request.restore();
            });

            it('should pass callback an error', function(done) {
                strategy._oauth2.getOAuthAccessToken('code', {}, function(err) {
                    err.should.equal('something bad has happened');
                    done();
                });
            });
        });
    });

    describe('when told to load user profile', function() {
        describe('on success', function() {
            before(function() {
                sinon.stub(strategy._oauth2, '_request').callsFake(function(method, url, headers, post_body, access_token, callback) {
                    headers.should.eql({'Authorization': 'Bearer something'});
                    var body = JSON.stringify({
                        "profile": "https://phantauth.net/user/sarah.connor/profile",
                        "sub": "sarah.connor",
                        "nickname": "Sarah",
                        "preferred_username": "sconnor",
                        "picture": "https://www.gravatar.com/avatar/fd370184875dc7445ca5d3eff7fab0fa?s=256&d=https://avatars.phantauth.net/ai/female/l9avlrdG.jpg",
                        "website": "https://phantauth.net",
                        "family_name": "Connor",
                        "given_name": "Sarah",
                        "email": "sarah.connor.6BFTDTI@mailinator.com",
                        "email_verified": true,
                        "gender": "female",
                        "birthdate": "1967-06-21",
                        "zoneinfo": "Europe/London",
                        "phone_number": "586-925-467",
                        "phone_number_verified": true,
                        "updated_at": 1529539200,
                        "me": "https://phantauth.net/~sarah.connor",
                        "password": "A0PCBAtD",
                        "webmail": "https://www.mailinator.com/v3/?zone=public&query=sarah.connor.6BFTDTI",
                        "uid": "kzx2Yp+5Z18",
                        "address": {
                        "formatted": "118 Highland Place\nNew York 05455",
                        "street_address": "118 Highland Place",
                        "locality": "New York",
                        "postal_code": "05455",
                        "country": "UnitedKingdom"
                        },
                        "name": "Sarah Connor",
                        "@id": "https://phantauth.net/user/sarah.connor"
                        });

                    callback(null, body, undefined);
                });
            });

            after(function() {
                strategy._oauth2._request.restore();
            });

            it('should not error', function(done) {
                strategy.userProfile('something', function(err, profile) {
                    should.not.exist(err);
                    done();
                });
            });

/*
 *   - `birthday`          the user's birthday
 *   - `addresses`         the user's physical mailing address as an object (`formatted`, `streetAddress`, `locality`,`region`, `postalCode`, `country` fields )

*/

            it('should load profile', function(done) {
                strategy.userProfile('something', function(err, profile) {
                    profile.provider.should.equal('phantauth');
                    profile.username.should.equal('sarah.connor');
                    profile.displayName.should.equal('Sarah Connor');
                    profile.preferredUsername.should.equal('sconnor');
                    profile.nickname.should.equal('Sarah');
                    profile.gender.should.equal('female');
                    profile.profileUrl.should.equal('https://phantauth.net/user/sarah.connor/profile');
                    profile.id.should.equal('sarah.connor');
                    profile.emails.length.should.equal(1);
                    profile.emails[0].value.should.startWith('sarah.connor');
                    profile.emails[0].type.should.equal('work');
                    profile.photos.length.should.equal(1);
                    profile.photos[0].value.should.startWith('https://www.gravatar.com/avatar/');
                    profile.photos[0].type.should.equal('thumbnail');
                    profile.phoneNumbers.length.should.equal(1);
                    profile.phoneNumbers[0].value.should.not.empty();
                    profile.phoneNumbers[0].type.should.equal('work');
                    profile.urls.length.should.equal(1);
                    profile.urls[0].value.should.equals('https://phantauth.net/user/sarah.connor/profile');
                    profile.urls[0].type.should.equal('work');
                    profile.addresses.length.should.equal(1);
                    should.not.exist(err);
                    done();
                });
            });

            it('should set raw property', function(done) {
                strategy.userProfile('something', function(err, profile) {
                    profile._raw.should.have.type('string');
                    done();
                });
            });

            it('should set json property', function(done) {
                strategy.userProfile('something', function(err, profile) {
                    profile._json.should.have.type('object');
                    done();
                });
            });
        });

        describe('on incorrect JSON answer', function() {
            before(function() {
                sinon.stub(strategy._oauth2, '_request').callsFake(function(method, url, headers, post_body, access_token, callback) {
                    headers.should.eql({'Authorization': 'Bearer something'});
                    var body = 'I\'m not a JSON, really!';

                    callback(null, body, undefined);
                });
            });

            after(function() {
                strategy._oauth2._request.restore();
            });

            it_should_handle_errors();
        });

        describe('on API GET error', function() {
            before(function() {
                sinon.stub(strategy._oauth2, '_request').callsFake(function(method, url, headers, post_body, access_token, callback) {
                    headers.should.eql({'Authorization': 'Bearer something'});
                    callback(new Error('something-went-wrong'));
                });
            });

            after(function() {
                strategy._oauth2._request.restore();
            });

            it_should_handle_errors();

            it('should wrap error in InternalOAuthError', function(done) {
                strategy.userProfile('something', function(err, profile) {
                    err.constructor.name.should.equal('InternalOAuthError');
                    done();
                });
            });
        });
    });
});
