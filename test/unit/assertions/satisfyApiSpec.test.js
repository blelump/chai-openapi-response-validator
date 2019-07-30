/*******************************************************************************
 * Copyright 2019 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *******************************************************************************/

const chai = require('chai');
const path = require('path');
const chaiResponseValidator = require('../../..');

const pathToApiSpec = path.resolve('test/exampleOpenApiFiles/valid/openapi.yml');
chai.use(chaiResponseValidator(pathToApiSpec));

const { expect } = chai;

describe('expect(res).to.satisfyApiSpec', function () {
  describe('when \'res\' matches a response defined in the API spec', function () {
    describe('\'res\' satisfies the spec', function () {
      describe('when the spec defines multiple responses', function () {
        describe('200 response', function () {
          const res = {
            status: 200,
            req: {
              method: 'GET',
              path: '/test',
            },
            body: 'valid body (string)',
          };

          it('passes', function () {
            expect(res).to.satisfyApiSpec;
          });

          it('fails when using .not', function () {
            const assertion = () => expect(res).to.not.satisfyApiSpec;
            expect(assertion).to.throw('expected res not to satisfy API spec for \'200\' response defined for endpoint \'GET /test\' in OpenAPI spec');
          });
        });
        describe('204 response', function () {
          const res = {
            status: 204,
            req: {
              method: 'GET',
              path: '/test',
            },
          };

          it('passes', function () {
            expect(res).to.satisfyApiSpec;
          });

          it('fails when using .not', function () {
            const assertion = () => expect(res).to.not.satisfyApiSpec;
            expect(assertion).to.throw('expected res not to satisfy API spec for \'204\' response defined for endpoint \'GET /test\' in OpenAPI spec');
          });
        });
      });
    });
    describe('\'res\' does NOT satisfy the spec', function () {
      describe('res.status', function () {
        const res = {
          status: 418,
          req: {
            method: 'GET',
            path: '/test',
          },
        };

        it('fails', function () {
          const assertion = () => expect(res).to.satisfyApiSpec;
          expect(assertion).to.throw('No \'418\' response defined for endpoint \'GET /test\' in OpenAPI spec');
        });

        it('fails when using .not', function () {
          const assertion = () => expect(res).not.to.satisfyApiSpec;
          expect(assertion).to.throw('No \'418\' response defined for endpoint \'GET /test\' in OpenAPI spec');
        });
      });

      describe('res.body', function () {
        const res = {
          status: 204,
          req: {
            method: 'GET',
            path: '/test',
          },
          body: 'invalid body (should be empty)',
        };

        it('fails', function () {
          const assertion = () => expect(res).to.satisfyApiSpec;
          expect(assertion).to.throw('The response was not valid');
        });

        it('passes when using .not', function () {
          expect(res).to.not.satisfyApiSpec;
        });
      });
    });
  });

  describe('when \'res\' does NOT match any responses defined in the API spec', function () {
    describe('no route defined', function () {
      const res = {
        status: 204,
        req: {
          method: 'GET',
          path: '/does/not/exist',
        },
      };

      it('fails', function () {
        const assertion = () => expect(res).to.satisfyApiSpec;
        expect(assertion).to.throw('No \'/does/not/exist\' route defined in OpenAPI spec');
      });

      it('fails when using .not', function () {
        const assertion = () => expect(res).to.not.satisfyApiSpec;
        expect(assertion).to.throw('No \'/does/not/exist\' route defined in OpenAPI spec');
      });
    });

    describe('no HTTP method defined for endpoint', function () {
      const res = {
        status: 204,
        req: {
          method: 'HEAD',
          path: '/test',
        },
      };

      it('fails', function () {
        const assertion = () => expect(res).to.satisfyApiSpec;
        expect(assertion).to.throw('No \'HEAD\' method defined for route \'/test\' in OpenAPI spec');
      });

      it('fails when using .not', function () {
        const assertion = () => expect(res).to.not.satisfyApiSpec;
        expect(assertion).to.throw('No \'HEAD\' method defined for route \'/test\' in OpenAPI spec');
      });
    });
  });
});