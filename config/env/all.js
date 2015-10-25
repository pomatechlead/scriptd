'use strict';

module.exports = {
  app: {
    title: 'scriptd'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || '330921340451691',
    clientSecret: process.env.FACEBOOK_SECRET || '2652f20750989a79f67f3abd86d3b04e',
    callbackURL: '/auth/facebook/callback'
  },
  mailer: {
    from: process.env.MAILER_FROM || 'scriptd@scriptd.com',
    options: {
      service: 'mandrill',
      auth: {
        user: 'denise@scriptd.com',
        pass: 'j7i_GC8blOOL32QA32EQlg'
      }
    }
  },
  AmazonS3: {
    AccessKey: process.env.AMAZON_S3_ACCESS_KEY || 'AKIAIJQS6VGDL5Q7RTTA',
    SecretKey: process.env.AMAZON_S3_SECRET_KEY || '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',
    StaticHost: 's3.amazonaws.com',
    StaticBucketName: process.env.AMAZON_S3_STATIC_BUCKET_NAME || 'scriptd',
    DynamicBucketName: process.env.AMAZON_S3_BUCKET_NAME || 'scriptduploads'
  },
  tempFolder: './scripts'
  
};
