class PlayerSerializer < ActiveModel::Serializer
  attributes :id, :name, :password_digest
end
