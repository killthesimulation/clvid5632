const Clover = require("../models/Clover");
const Wallet = require("../models/Wallet");
const PartyReferralCode = require("../models/PartyReferralCode");
const walletController = require("../controllers/walletController");
const configController = require("../controllers/configController");
const bonusCapController = require("../controllers/bonusCapController");
const transactionController = require("../controllers/transactionController");
const sellOrderController = require("../controllers/sellOrderController");



const functions = require('../tools/functions');
const SellOrder = require("../models/SellOrder");




exports.mintPremiumClv = function (id, amount, wallet, paid, type) {
  return new Promise((resolve, reject) => {
    const newPremiumClv = new Clover({
      amount: amount,
      initialAmount: amount,
      owner: id,
      type: "premium",
    });

    newPremiumClv
      .save()
      .then((premiumClv) => {
        transactionController
          .createTransaction(wallet, amount, paid, type)
          .then((transaction) => {
            resolve(transaction);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.mintFreeClv = function (id, amount, wallet, paid, type) {
  return new Promise((resolve, reject) => {
    const newFreeClv = new Clover({
      amount: amount,
      initialAmount: amount,
      owner: id,
      type: "free",
    });

    newFreeClv
      .save()
      .then((freeClv) => {
        transactionController
          .createTransaction(wallet, amount, paid, type)
          .then((transaction) => {
            resolve(transaction);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.ReferralClvMaster = function (referralCode, boughtAmount, source) {
  return new Promise((resolve, reject) => {
    configController
      .configGetPercent()
      .then((percent) => {
        const referralAmount = Number(percent) * Number(boughtAmount);

        if (referralCode.length === 6 || referralCode.length === 7) {
          if (referralCode.length === 6) {
            Wallet.findOne({ codeReferral: referralCode })
              .then((wallet) => {
                if (wallet) {
                  this.mintReferralClv(
                    wallet._id,
                    referralAmount,
                    source,
                    wallet,
                    "None",
                    "Referral"
                  )
                    .then((referralClv) => {
                      resolve(referralClv);
                    })
                    .catch((err) => {
                      reject(err);
                    });
                } else {
                  //Wrong referral code so send referrals to agape wallet

                  Wallet.findOne({ _id: "5f6f3f09f11bf8242bc2983f" })
                    .then((wallet) => {
                      this.mintReferralClv(
                        wallet._id,
                        referralAmount,
                        source,
                        wallet,
                        "None",
                        "Referral"
                      )
                        .then((referralClv) => {
                          resolve(referralClv);
                        })
                        .catch((err) => {
                          reject(err);
                        });
                    })
                    .catch((err) => {
                      reject(err);
                    });
                }
              })
              .catch((err) => {
                reject(err);
              });
          } else if (referralCode.length === 7) {
            //Party referral code

            PartyReferralCode.findOne({ codeReferral: referralCode })
              .then((partyReferralCode) => {
                if (partyReferralCode) {
                  partyReferralCode.users.forEach((user) => {
                    Wallet.findOne({ codeReferral: user.referralCode })
                      .then((wallet) => {
                        const userPercent = user.percent / 100;
                        const referralPart = (
                          referralAmount * userPercent
                        ).toFixed(4);
                        this.mintReferralClv(
                          wallet._id,
                          referralPart,
                          source,
                          wallet,
                          "None",
                          "Referral"
                        )
                          .then((referralClv) => {
                            // console.log(referralClv);
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  });

                  resolve("Success");
                } else {
                  //Wrong referral code so send referrals to agape wallet

                  Wallet.findOne({ _id: "5f6f3f09f11bf8242bc2983f" })
                    .then((wallet) => {
                      this.mintReferralClv(
                        wallet._id,
                        referralAmount,
                        source,
                        wallet,
                        "None",
                        "Referral"
                      )
                        .then((referralClv) => {
                          resolve(referralClv);
                        })
                        .catch((err) => {
                          reject(err);
                        });
                    })
                    .catch((err) => {
                      reject(err);
                    });
                }
              })
              .catch((err) => {
                reject(err);
              });
          }
        } else {
          //Wrong referral code so send referrals to agape wallet

          Wallet.findOne({ _id: "5f6f3f09f11bf8242bc2983f" })
            .then((wallet) => {
              this.mintReferralClv(
                wallet._id,
                referralAmount,
                source,
                wallet,
                "None",
                "Referral"
              )
                .then((referralClv) => {
                  resolve(referralClv);
                })
                .catch((err) => {
                  reject(err);
                });
            })
            .catch((err) => {
              reject(err);
            });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.mintReferralClv = function (
  ownerId,
  amount,
  source,
  wallet,
  paid,
  type
) {
  return new Promise((resolve, reject) => {
    const newReferralClv = new Clover({
      amount: amount,
      initialAmount: amount,
      owner: ownerId,
      type: "free",
      subType: "referral",
      source: source,
    });
    newReferralClv
      .save()
      .then((referralClv) => {
        transactionController
          .createTransaction(wallet, amount, paid, type)
          .then((transaction) => {
            resolve(transaction);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.addBonus = function (id, amount, wallet, paid, type) {
  return new Promise((resolve, reject) => {
    if (amount > 0) {
      const total = amount;

      const newFreeClv = new Clover({
        amount: total,
        initialAmount: amount,
        owner: id,
        type: "free",
      });

      newFreeClv
        .save()
        .then((freeClv) => {
          transactionController
            .createTransaction(wallet, total, paid, type)
            .then((transaction) => {
              resolve(transaction);
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
    } else {
      resolve("Success");
    }
  });
};

exports.giveSignUpReferralBonus = function (id, referralCode, source) {
  return new Promise((resolve, reject) => {
    if (referralCode.length === 6 || referralCode.length === 7) {
      if (referralCode.length === 6) {
        Wallet.findOne({ codeReferral: referralCode })
          .then((wallet) => {
            if (wallet) {
              bonusCapController
                .checkBonusCap(wallet.codeReferral)
                .then((result) => {
                  configController
                    .configGetPrice()
                    .then((price) => {
                      const amount = (5 / price).toFixed(4);

                      if (result) {
                        this.mintReferralClv(
                          wallet._id,
                          amount,
                          source,
                          wallet,
                          "None",
                          "Bonus"
                        )
                          .then((referralClv) => {
                            Wallet.findOne({ _id: id })
                              .then((wallet2) => {
                                this.mintReferralClv(
                                  wallet2._id,
                                  amount,
                                  wallet.codeReferral,
                                  wallet2,
                                  "None",
                                  "Bonus"
                                )
                                  .then((referralClv) => {
                                    bonusCapController
                                      .increaseBonusCapValue(
                                        wallet.codeReferral
                                      )
                                      .then((bonusCap) => {
                                        resolve(bonusCap);
                                      })
                                      .catch((err) => {
                                        reject(err);
                                      });
                                  })
                                  .catch((err) => {
                                    reject(err);
                                  });
                              })
                              .catch((err) => {
                                reject(err);
                              });
                          })
                          .catch((err) => {
                            reject(err);
                          });
                      } else {
                        //Not allowed to get bonus but give bonus to user2
                        Wallet.findOne({ _id: id })
                          .then((wallet3) => {
                            this.mintReferralClv(
                              wallet3._id,
                              amount,
                              wallet.codeReferral,
                              wallet3,
                              "None",
                              "Bonus"
                            )
                              .then((referralClv) => {
                                resolve(referralClv);
                              })
                              .catch((err) => {
                                reject(err);
                              });
                          })
                          .catch((err) => {
                            reject(err);
                          });
                      }
                    })
                    .catch((err) => {
                      reject(err);
                    });
                })
                .catch((err) => {
                  reject(err);
                });
            } else {
              reject("Wrong referral code");
            }
          })
          .catch((err) => {
            reject(err);
          });
      } else if (referralCode.length === 7) {
        //party code section

        PartyReferralCode.findOne({ codeReferral: referralCode })
          .then((partyReferralCode) => {
            if (partyReferralCode) {
              bonusCapController
                .checkBonusCap(partyReferralCode.codeReferral)
                .then((result) => {
                  configController
                    .configGetPrice()
                    .then((price) => {
                      const amount = (5 / price).toFixed(4);

                      if (result) {
                        partyReferralCode.users.forEach((user) => {
                          Wallet.findOne({ codeReferral: user.referralCode })
                            .then((wallet) => {
                              const userPercent = user.percent / 100;
                              const referralPart = (
                                amount * userPercent
                              ).toFixed(4);
                              this.mintReferralClv(
                                wallet._id,
                                referralPart,
                                source,
                                wallet,
                                "None",
                                "Bonus"
                              )
                                .then((referralClv) => {
                                  // console.log(referralClv);
                                })
                                .catch((err) => {
                                  console.log(err);
                                });
                            })
                            .catch((err) => {
                              console.log(err);
                            });
                        });

                        Wallet.findOne({ _id: id })
                          .then((wallet2) => {
                            this.mintReferralClv(
                              wallet2._id,
                              amount,
                              referralCode,
                              wallet2,
                              "None",
                              "Bonus"
                            )
                              .then((referralClv) => {
                                bonusCapController
                                  .increaseBonusCapValue(
                                    partyReferralCode.codeReferral
                                  )
                                  .then((bonusCap) => {
                                    resolve(bonusCap);
                                  })
                                  .catch((err) => {
                                    reject(err);
                                  });
                              })
                              .catch((err) => {
                                reject(err);
                              });
                          })
                          .catch((err) => {
                            reject(err);
                          });
                      } else {
                        //Not allowed to get bonus but give bonus to user2
                        Wallet.findOne({ _id: id })
                          .then((wallet2) => {
                            this.mintReferralClv(
                              wallet2._id,
                              amount,
                              referralCode,
                              wallet2,
                              "None",
                              "Bonus"
                            )
                              .then((referralClv) => {
                                resolve(referralClv);
                              })
                              .catch((err) => {
                                reject(err);
                              });
                          })
                          .catch((err) => {
                            reject(err);
                          });
                      }
                    })
                    .catch((err) => {
                      reject(err);
                    });
                })
                .catch((err) => {
                  reject(err);
                });
            } else {
              reject("Wrong referral code");
            }
          })
          .catch((err) => {
            reject(err);
          });
      }
    } else {
      reject("Wrong referral code");
    }
  });
};

exports.getPremiumClv = function (id) {
  return new Promise((resolve, reject) => {

    walletController.getPersonalLockDownPeriod(id)
      .then(lockPeriod => {
        
        configController.configGetPrice().then((price) => {
          const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          let premiumClvs = [];
          let premiumClvsAmount = 0;
          Clover.find({ owner: id, type: "premium" })
            .then((premiumClv) => {
              premiumClv.forEach((item) => {
                const datePurchased = item.dateCreated;
                const datePurchasedFormated = `${datePurchased.getDate()} ${
                  monthNames[datePurchased.getMonth()]
                } ${datePurchased.getYear() + 1900}`;
                const lockDate = new Date(
                  datePurchased.setMonth(datePurchased.getMonth() + lockPeriod)
                );
                const lockDateFormated = `${lockDate.getDate()} ${
                  monthNames[lockDate.getMonth()]
                } ${lockDate.getYear() + 1900}`;
                const clvItem = {
                  amount: item.amount,
                  usd: (Number(item.amount) * Number(price)).toFixed(4),
                  type: item.type,
                  created: datePurchasedFormated,
                  lock: lockDateFormated,
                };
                premiumClvsAmount += item.amount;
                premiumClvs.push(clvItem);
              });
    
              const data = {
                clv: premiumClvs,
                amount: premiumClvsAmount,
                usd: (premiumClvsAmount * price).toFixed(4),
              };
    
              resolve(data);
            })
            .catch((err) => {
              reject(err);
            });
        });
      })
      .catch((err) => {
        reject(err);
      });



  




  });
};

exports.getReferralClv = function (id) {
  return new Promise((resolve, reject) => {
    configController.configGetPrice().then((price) => {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      let referralClvs = [];
      let referralClvsAmount = 0;
      Clover.find({ owner: id, subType: "referral" })
        .then((referralClv) => {
          referralClv.forEach((item) => {
            const datePurchased = item.dateCreated;
            const datePurchasedFormated = `${datePurchased.getDate()} ${
              monthNames[datePurchased.getMonth()]
            } ${datePurchased.getYear() + 1900}`;
            const lockDate = new Date(
              datePurchased.setYear(datePurchased.getFullYear() + 1)
            );
            const lockDateFormated = `${lockDate.getDate()} ${
              monthNames[lockDate.getMonth()]
            } ${lockDate.getYear() + 1900}`;
            const clvItem = {
              amount: item.amount,
              usd: (Number(item.amount) * Number(price)).toFixed(4),
              type: item.type,
              created: datePurchasedFormated,
              lock: lockDateFormated,
              source: item.source,
            };
            referralClvsAmount += item.amount;
            referralClvs.push(clvItem);
          });
          const data = {
            clv: referralClvs,
            amount: referralClvsAmount,
            usd: (referralClvsAmount * price).toFixed(4),
          };

          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
};

exports.getFreeClv = function (id) {
  return new Promise((resolve, reject) => {
    configController.configGetPrice().then((price) => {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      let freeClvs = [];
      let freeClvsAmount = 0;
      Clover.find({ owner: id, type: "free" })
        .then((freeClv) => {
          freeClv.forEach((item) => {
            const datePurchased = item.dateCreated;
            const datePurchasedFormated = `${datePurchased.getDate()} ${
              monthNames[datePurchased.getMonth()]
            } ${datePurchased.getYear() + 1900}`;
            const lockDate = new Date(
              datePurchased.setYear(datePurchased.getFullYear() + 1)
            );
            const lockDateFormated = `${lockDate.getDate()} ${
              monthNames[lockDate.getMonth()]
            } ${lockDate.getYear() + 1900}`;

            const clvItem = {
              amount: item.amount,
              usd: (Number(item.amount) * Number(price)).toFixed(4),
              type: item.type,
              created: datePurchasedFormated,
              lock: lockDateFormated,
            };

            freeClvsAmount += item.amount;
            freeClvs.push(clvItem);
          });
          const data = {
            clv: freeClvs,
            amount: freeClvsAmount,
            usd: (freeClvsAmount * price).toFixed(4),
          };

          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
};


exports.deleteClv = function (id) {
  return new Promise((resolve, reject) => {
    console.log(id);
    Clover.deleteOne({_id: id})
      .then(result => {
        SellOrder.findOne({clvId: id})
          .then(newSellOrder => {
            if(newSellOrder){
              newSellOrder.active = false;
            newSellOrder.save()
              .then(resultDebug => {
                resolve(result);
              })
            }
            resolve(result);
          })
        
      })
  })
}

exports.getAllClvForDashboard = function (id) {
  return new Promise((resolve, reject) => {








    walletController.getPersonalLockDownPeriod(id)
      .then(premiumLockDown => {

        walletController.getPersonalLockDownPeriodFree(id)
          .then(freeLockDown => {

            configController.configGetPrice().then((price) => {
              const monthNames = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ];
              let clvs = [];
              let clvsAmount = 0;
              Clover.find({ owner: id })
                .then((clv) => {
                  clv.forEach((item) => {
                    const datePurchased = item.dateCreated;
                    const datePurchasedFormated = `${datePurchased.getDate()} ${
                      monthNames[datePurchased.getMonth()]
                    } ${datePurchased.getYear() + 1900}`;
        
                    let lockDateFormated;
                    if (item.type === "free") {
                      const lockDate = new Date(
                        datePurchased.setMonth(datePurchased.getMonth() + freeLockDown)
                      );
                      lockDateFormated = `${lockDate.getDate()} ${
                        monthNames[lockDate.getMonth()]
                      } ${lockDate.getYear() + 1900}`;
                    } else if (item.type === "premium") {
                      const lockDate = new Date(
                        datePurchased.setMonth(datePurchased.getMonth() + premiumLockDown)
                      );
                      lockDateFormated = `${lockDate.getDate()} ${
                        monthNames[lockDate.getMonth()]
                      } ${lockDate.getYear() + 1900}`;
                    }
        
                    const clvItem = {
                      id: item._id + '',
                      amount: item.amount,
                      usd: (Number(item.amount) * Number(price)).toFixed(4),
                      type: item.type,
                      created: datePurchasedFormated,
                      lock: lockDateFormated,
                    };
        
                    clvsAmount += item.amount;
                    clvs.push(clvItem);
                  });
                  const data = {
                    clv: clvs,
                    amount: clvsAmount,
                    usd: (clvsAmount * price).toFixed(4),
                  };
        
                  resolve(data);
                })
                .catch((err) => {
                  reject(err);
                });
            });
    

          })
          .catch((err) => {
            reject(err);
          });




        









      })
      .catch((err) => {
        reject(err);
      });







  });
};

exports.getClvAmount = function () {
  return new Promise((resolve, reject) => {
    let amount = 0;
    Clover.find({})
      .then((clvs) => {
        clvs.forEach((item) => {
          amount += item.amount;
        });
        resolve(amount);
      })
      .catch((err) => {
        reject(err);
      });
  });
};


exports.getAllCloversForExcell = function () {
  return new Promise((resolve, reject) => {
    Clover.find({})
      .then((clvs) => {
        resolve(clvs);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

exports.getPremiumClvAmount = function () {
  return new Promise((resolve, reject) => {
    let amount = 0;
    Clover.find({ type: "premium" })
      .then((clvs) => {
        clvs.forEach((item) => {
          amount += item.amount;
        });
        resolve(amount);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.getFreeClvAmount = function () {
  return new Promise((resolve, reject) => {
    let amount = 0;
    Clover.find({ type: "free" })
      .then((clvs) => {
        clvs.forEach((item) => {
          amount += item.amount;
        });
        resolve(amount);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.getReferralClvAmount = function () {
  return new Promise((resolve, reject) => {
    let amount = 0;
    Clover.find({ subType: "referral" })
      .then((clvs) => {
        clvs.forEach((item) => {
          amount += item.amount;
        });
        resolve(amount);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.makeDonation = function (
  clvAmount,
  donationPercent1,
  donationPercent2,
  donationPercent3,
  donationPercent4,
  donationPercent5,
  donationPercent6
) {
  if (donationPercent1 > 0) {
    walletController.findWallet("5fda8b2c4eb4a7318c633caa").then((wallet1) => {
      const amount1 = clvAmount * (donationPercent1 / 100);
      this.mintFreeClv(
        "5fda8b2c4eb4a7318c633caa",
        amount1,
        wallet1,
        "none",
        "Donation"
      ).then((result) => {});
    });
  }

  if (donationPercent2 > 0) {
    walletController.findWallet("5fda8b7a4eb4a7318c633cab").then((wallet2) => {
      const amount2 = clvAmount * (donationPercent2 / 100);
      this.mintFreeClv(
        "5fda8b7a4eb4a7318c633cab",
        amount2,
        wallet2,
        "none",
        "Donation"
      ).then((result) => {});
    });
  }

  if (donationPercent3 > 0) {
    walletController.findWallet("5f6f3f09f11bf8242bc2983f").then((wallet3) => {
      const amount3 = clvAmount * (donationPercent3 / 100);
      this.mintFreeClv(
        "5f6f3f09f11bf8242bc2983f",
        amount3,
        wallet3,
        "none",
        "Donation"
      ).then((result) => {});
    });
  }

  if (donationPercent4 > 0) {
    walletController.findWallet("5fda8bc34eb4a7318c633cac").then((wallet4) => {
      const amount4 = clvAmount * (donationPercent4 / 100);
      this.mintFreeClv(
        "5fda8bc34eb4a7318c633cac",
        amount4,
        wallet4,
        "none",
        "Donation"
      ).then((result) => {});
    });
  }

  if (donationPercent5 > 0) {
    walletController.findWallet("5fda8c184eb4a7318c633cad").then((wallet5) => {
      const amount5 = clvAmount * (donationPercent5 / 100);
      this.mintFreeClv(
        "5fda8c184eb4a7318c633cad",
        amount5,
        wallet5,
        "none",
        "Donation"
      ).then((result) => {});
    });
  }

  if (donationPercent6 > 0) {
    walletController.findWallet("5fda8c664eb4a7318c633cae").then((wallet6) => {
      const amount6 = clvAmount * (donationPercent6 / 100);
      this.mintFreeClv(
        "5fda8c664eb4a7318c633cae",
        amount6,
        wallet6,
        "none",
        "Donation"
      ).then((result) => {});
    });
  }
};



exports.getPremiumClvForMarketPlace = function (id) {
  return new Promise((resolve, reject) => {


    walletController.getPersonalRestrictionPercentSellPerMounth(id)
      .then(sellRestriction => {

        walletController.getPersonalLockDownPeriod(id)
      .then(premiumLockUp => {

        const dateNow = new Date();
        const buyDate = new Date(dateNow.setMonth(dateNow.getMonth() - premiumLockUp));
    
        let clv = [];
    
        configController.configGetPrice().then((price) => {
          sellOrderController
            .getClvInSellOrders(id)
            .then((clvInSellOrders) => {
              sellOrderController
                .getSellCap()
                .then((sellCap) => {
                  Clover.find({
    
    
                    $and: [{'dateCreated' :{ $lt: buyDate }},{'owner': id},{'_id' : {$nin: clvInSellOrders }}, {'_id': {$nin: sellCap}}, {'type': 'premium'}]
    
    
                  })
                    .then((result) => {
                      const monthNames = [
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ];
    
                      result.forEach((item) => {
                        const clvItem = {
                          id: item._id,
                          date: `${item.dateCreated.getDate()} ${
                            monthNames[item.dateCreated.getMonth()]
                          } ${item.dateCreated.getFullYear()}`,
                          availableToSell: item.initialAmount * (sellRestriction/100),
                          availableToSellUs: (item.initialAmount * (sellRestriction/100)) * price,
                          amount: item.amount,
                          usAmount: item.amount * price,
                        };
    
                        clv.push(clvItem);
                      });
    
                      resolve(clv);
                    })
                    .catch((err) => {
                      reject(err);
                    });
                })
                .catch((err) => {
                  reject(err);
                });
            })
            .catch((err) => {
              reject(err);
            });
        });

      })
      .catch((err) => {
        reject(err);
      });


      })


    











  });
};







exports.getFreeClvForMarketPlace = function (id) {
  return new Promise((resolve, reject) => {



    walletController.getPersonalRestrictionPercentSellPerMounth(id)
    .then(sellRestriction => {



      walletController.getPersonalLockDownPeriodFree(id)
      .then(freeLockUp => {

        const dateNow = new Date();
        const buyDate = new Date(dateNow.setMonth(dateNow.getMonth() - freeLockUp));
    
        let clv = [];
    
        configController.configGetPrice().then((price) => {
          sellOrderController
            .getClvInSellOrders(id)
            .then((clvInSellOrders) => {
              sellOrderController
                .getSellCap()
                .then((sellCap) => {
                  Clover.find({
    
    
                    $and: [{'dateCreated' :{ $lt: buyDate }},{'owner': id},{'_id' : {$nin: clvInSellOrders }}, {'_id': {$nin: sellCap}}, {'type': 'free'}]
    
    
                  })
                    .then((result) => {
                      const monthNames = [
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ];
    
                      result.forEach((item) => {
                        const clvItem = {
                          id: item._id,
                          date: `${item.dateCreated.getDate()} ${
                            monthNames[item.dateCreated.getMonth()]
                          } ${item.dateCreated.getFullYear()}`,
                          availableToSell: item.initialAmount * (sellRestriction/100),
                          availableToSellUs: (item.initialAmount * (sellRestriction/100)) * price,
                          amount: item.amount,
                          usAmount: item.amount * price,
                        };
    
                        clv.push(clvItem);
                      });
    
                      resolve(clv);
                    })
                    .catch((err) => {
                      reject(err);
                    });
                })
                .catch((err) => {
                  reject(err);
                });
            })
            .catch((err) => {
              reject(err);
            });
        });

      })
      .catch((err) => {
        reject(err);
      });



    })


   








  });
};




exports.adminGetClvInformation = function () {
  return new Promise((resolve, reject) => {
    let clvSoldAmount = 0;
    let clvLeftAmount = 0;
    let premiumClvSold = 0;
    let freeClvGiven = 0;
    let referralClvEarned = 0;
    Clover.find({})
      .then(clvSold => {
        clvSold.forEach((item) => {
          clvSoldAmount += item.amount;
        })
        clvLeftAmount = 100000000000 - clvSoldAmount;

        Clover.find({ type: "premium" })
          .then(premiumClv => {
            premiumClv.forEach((item) => {
              premiumClvSold += item.amount;
            })


            Clover.find({ type: "free" })
              .then(freeClv => {
                freeClv.forEach((item) => {
                  freeClvGiven += item.amount;
                })

                Clover.find({ subType: "referral" })
                  .then(referralClv => {
                    referralClv.forEach((item) => {
                      referralClvEarned += item.amount;
                    })


                    const data = {
                      clvLeftAmount : functions.numberWithSpacesFloat(clvLeftAmount.toFixed(4)),
                      premiumClvSold : functions.numberWithSpacesFloat(premiumClvSold.toFixed(4)),
                      freeClvGiven : functions.numberWithSpacesFloat(freeClvGiven.toFixed(4)),
                      referralClvEarned : functions.numberWithSpacesFloat(referralClvEarned.toFixed(4))
                    }

                    resolve(data);


                  })
              })
          })
      })
  })
}