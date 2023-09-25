import { BadRequestError } from "../../../core"
import { ProjectToken } from "../../../project/token"
import { Wallet } from "../models/wallet.model"
import { WalletToken } from "../models/wallet_token"

export class WalletService {
  constructor(
    private readonly dbWallet: typeof Wallet,
    private readonly dbWalletInformation: typeof WalletToken,
  ) {}

  public create_wallet = async (user_id: string) => {
    const wallet = await this.dbWallet.findOne({
      where: { wallet_owner_id: user_id },
    })

    if (wallet) {
      throw new BadRequestError("User Cannot have more than one Wallet")
    }

    const newWallet = await this.dbWallet.create({
      wallet_owner_id: user_id,
    })
  }

  public get_user_wallet = async (user_id: string) => {
    const user_wallet = await this.dbWallet.findOne({
      where: {
        wallet_owner_id: user_id,
      },
    })

    if (!user_wallet) {
      throw new BadRequestError("User does not have a wallet")
    }

    const user_wallet_token = await this.dbWalletInformation.findAll({
      where: {
        wallet_id: user_wallet.wallet_id,
      },
      include: [
        {
          model: ProjectToken,
          as: "projectToken",
          attributes: ["token_name", "token_value", "token_id"],
        },
      ],
    })
    return { wallet: user_wallet, wallet_tokens: user_wallet_token }
  }

  public get_user_wallet_token = async (user_id: string, token_id: string) => {
    const { wallet } = await this.get_user_wallet(user_id)

    const user_wallet_token = await this.dbWalletInformation.findOne({
      where: {
        wallet_id: wallet.wallet_id,
        token_id,
      },
    })

    return user_wallet_token
  }

  public async doesUserHaveSufficientBalance(
    user_id: string,
    amount: number,
    token_id: string,
  ) {
    const user_wallet_information = await this.get_user_wallet_token(
      user_id,
      token_id,
    )

    if (!user_wallet_information) {
      throw new BadRequestError(
        "User does not have contributions to this Token",
      )
    }

    if (user_wallet_information.token_owned_amount < amount) {
      throw new BadRequestError("Insufficient Balance")
    }

    return true
  }

  public addNewWalletToken = async (input: {
    token_id: string
    user_id: string
    amount: number
  }) => {
    const { amount, token_id, user_id } = input

    const { wallet } = await this.get_user_wallet(user_id)

    const user_wallet_token = await this.get_user_wallet_token(
      user_id,
      token_id,
    )

    if (user_wallet_token) {
      throw new BadRequestError("Token Exists in Wallet")
    }

    const new_wallet_token = await this.dbWalletInformation.create({
      wallet_id: wallet.wallet_id,
      token_owned_amount: amount,
      token_id,
    })

    return new_wallet_token
  }
}

export const walletService = new WalletService(Wallet, WalletToken)
