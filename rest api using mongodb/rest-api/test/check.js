import {expect} from 'chai'
import verifyUser from '../middleware/auth.js'
import Sinon from 'sinon'
import jwt from "jsonwebtoken"

describe('1) auth-middleware', () => {

  it("should be check for the presence of the authorization header", async () => {
    const req = {
      cookies: {
        token: null 
      }
    }
    try {
      await verifyUser(req, {}, () => {})
      expect.fail('expected that verifyUser fail the test.')
    } catch (error) {
      expect(error.message).to.equals('unauthenticated.')
    }
  })

  it("should be validating the token using jwt.verity()", async() => {
    const req = {
      cookies: {
        token: 'null' 
      }
    }
    Sinon.stub(jwt, 'verify')
    jwt.verify.returns({userId: '123'})
    await verifyUser(req, {}, () => {})
    expect(req).to.have.property('userId')
    jwt.verify.restore()
  })

  it('should return the decodedToken while verifying token.', async () => {
    const req = {
      cookies: {
        token: 'Beared asdf'
      }
    }
    try {
      await verifyUser(req, {}, () => {})
      expect.fail('expected that verifyUser fail the test.')
    } catch (error) {
      expect(error.name).to.equals('JsonWebTokenError')
      expect(error.message).to.equals('jwt malformed')
    }
  })
})
