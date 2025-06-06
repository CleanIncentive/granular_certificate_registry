"""gcb_device_issuance_normalisation

Revision ID: 2cb0ec2de122
Revises: 82a3317c274a
Create Date: 2024-10-10 14:57:11.842856

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from gc_registry.certificate.schemas import CertificateStatus

# revision identifiers, used by Alembic.
revision: str = '2cb0ec2de122'
down_revision: Union[str, None] = '82a3317c274a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    status_enum = sa.Enum(CertificateStatus, name="certificatestatus")
    status_enum.create(op.get_bind())  # Create it in the database

    op.create_table('issuancemetadata',
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('country_of_issuance', sa.VARCHAR(), nullable=False),
    sa.Column('connected_grid_identification', sa.VARCHAR(), nullable=False),
    sa.Column('issuing_body', sa.VARCHAR(), nullable=False),
    sa.Column('legal_status', sa.VARCHAR(), nullable=True),
    sa.Column('issuance_purpose', sa.VARCHAR(), nullable=True),
    sa.Column('support_received', sa.VARCHAR(), nullable=True),
    sa.Column('quality_scheme_reference', sa.VARCHAR(), nullable=True),
    sa.Column('dissemination_level', sa.VARCHAR(), nullable=True),
    sa.Column('issue_market_zone', sa.VARCHAR(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.add_column('account', sa.Column('created_at', sa.DateTime(), nullable=False))
    op.add_column('account', sa.Column('user_ids', sa.ARRAY(sa.String()), nullable=True))
    op.add_column('account', sa.Column('is_deleted', sa.Boolean(), nullable=False))
    op.drop_column('account', 'ids')
    op.add_column('device', sa.Column('created_at', sa.DateTime(), nullable=False))
    op.add_column('device', sa.Column('is_storage', sa.Boolean(), nullable=False))
    op.add_column('device', sa.Column('is_deleted', sa.Boolean(), nullable=False))
    op.add_column('granularcertificateaction', sa.Column('created_at', sa.DateTime(), nullable=False))
    op.add_column('granularcertificateaction', sa.Column('is_deleted', sa.Boolean(), nullable=False))
    op.alter_column('granularcertificateaction', 'id',
               existing_type=sa.INTEGER(),
               nullable=False,
               autoincrement=True)
    op.alter_column(
        "granularcertificateaction",
        "certificate_status",
        existing_type=sa.String(),
        type_=status_enum,
        postgresql_using="certificate_status::certificatestatus",
        existing_nullable=False,
    )
    op.drop_column('granularcertificateaction', 'action_id')
    op.add_column('granularcertificatebundle', sa.Column('metadata_id', sa.Integer(), nullable=False))
    op.add_column('granularcertificatebundle', sa.Column('is_storage', sa.Integer(), nullable=False))
    op.add_column('granularcertificatebundle', sa.Column('created_at', sa.DateTime(), nullable=False))
    op.alter_column(
        "granularcertificatebundle",
        "certificate_status",
        existing_type=sa.String(),
        type_=status_enum,
        postgresql_using="certificate_status::certificatestatus",
        existing_nullable=False,
    )
    op.drop_constraint('granularcertificatebundle_storage_id_fkey', 'granularcertificatebundle', type_='foreignkey')
    op.create_foreign_key('issuancemetadata_fk', 'granularcertificatebundle', 'issuancemetadata', ['metadata_id'], ['id'])
    op.drop_column('granularcertificatebundle', 'issuance_datestamp')
    op.drop_column('granularcertificatebundle', 'device_production_start_date')
    op.drop_column('granularcertificatebundle', 'country_of_issuance')
    op.drop_column('granularcertificatebundle', 'device_location')
    op.drop_column('granularcertificatebundle', 'issuance_purpose')
    op.drop_column('granularcertificatebundle', 'registry_configuration')
    op.drop_column('granularcertificatebundle', 'device_type')
    op.drop_column('granularcertificatebundle', 'quality_scheme_reference')
    op.drop_column('granularcertificatebundle', 'issuing_body')
    op.drop_column('granularcertificatebundle', 'device_name')
    op.drop_column('granularcertificatebundle', 'legal_status')
    op.drop_column('granularcertificatebundle', 'discharging_start_datetime')
    op.drop_column('granularcertificatebundle', 'support_received')
    op.drop_column('granularcertificatebundle', 'storage_id')
    op.drop_column('granularcertificatebundle', 'device_capacity')
    op.drop_column('granularcertificatebundle', 'device_technology_type')
    op.drop_column('granularcertificatebundle', 'discharging_end_datetime')
    op.drop_column('granularcertificatebundle', 'storage_device_location')
    op.drop_column('granularcertificatebundle', 'dissemination_level')
    op.drop_column('granularcertificatebundle', 'issue_market_zone')
    op.drop_column('granularcertificatebundle', 'connected_grid_identification')
    op.add_column('measurementreport', sa.Column('created_at', sa.DateTime(), nullable=False))
    op.add_column('measurementreport', sa.Column('is_deleted', sa.Boolean(), nullable=False))
    op.add_column('secureapiuser', sa.Column('is_deleted', sa.Boolean(), nullable=False))
    op.add_column('storageaction', sa.Column('created_at', sa.DateTime(), nullable=False))
    op.add_column('storageaction', sa.Column('is_deleted', sa.Boolean(), nullable=False))
    op.add_column('storagechargerecord', sa.Column('created_at', sa.DateTime(), nullable=False))
    op.add_column('storagechargerecord', sa.Column('is_deleted', sa.Boolean(), nullable=False))
    op.add_column('storagedischargerecord', sa.Column('created_at', sa.DateTime(), nullable=False))
    op.add_column('storagedischargerecord', sa.Column('is_deleted', sa.Boolean(), nullable=False))
    op.add_column('tokenblacklist', sa.Column('is_deleted', sa.Boolean(), nullable=False))
    op.add_column('user', sa.Column('created_at', sa.DateTime(), nullable=False))
    op.add_column('user', sa.Column('roles', sa.ARRAY(sa.String()), nullable=True))
    op.add_column('user', sa.Column('is_deleted', sa.Boolean(), nullable=False))
    op.drop_column('user', 'role')
    op.add_column('useraccountlink', sa.Column('created_at', sa.DateTime(), nullable=False))
    op.add_column('useraccountlink', sa.Column('is_deleted', sa.Boolean(), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('useraccountlink', 'is_deleted')
    op.drop_column('useraccountlink', 'created_at')
    op.add_column('user', sa.Column('role', postgresql.ARRAY(sa.VARCHAR()), autoincrement=False, nullable=True))
    op.drop_column('user', 'is_deleted')
    op.drop_column('user', 'roles')
    op.drop_column('user', 'created_at')
    op.drop_column('tokenblacklist', 'is_deleted')
    op.drop_column('storagedischargerecord', 'is_deleted')
    op.drop_column('storagedischargerecord', 'created_at')
    op.drop_column('storagechargerecord', 'is_deleted')
    op.drop_column('storagechargerecord', 'created_at')
    op.drop_column('storageaction', 'is_deleted')
    op.drop_column('storageaction', 'created_at')
    op.drop_column('secureapiuser', 'is_deleted')
    op.drop_column('measurementreport', 'is_deleted')
    op.drop_column('measurementreport', 'created_at')
    op.add_column('granularcertificatebundle', sa.Column('connected_grid_identification', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.add_column('granularcertificatebundle', sa.Column('issue_market_zone', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.add_column('granularcertificatebundle', sa.Column('dissemination_level', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('granularcertificatebundle', sa.Column('storage_device_location', postgresql.ARRAY(sa.DOUBLE_PRECISION(precision=53)), autoincrement=False, nullable=True))
    op.add_column('granularcertificatebundle', sa.Column('discharging_end_datetime', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    op.add_column('granularcertificatebundle', sa.Column('device_technology_type', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.add_column('granularcertificatebundle', sa.Column('device_capacity', sa.INTEGER(), autoincrement=False, nullable=False))
    op.add_column('granularcertificatebundle', sa.Column('storage_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('granularcertificatebundle', sa.Column('support_received', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('granularcertificatebundle', sa.Column('discharging_start_datetime', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    op.add_column('granularcertificatebundle', sa.Column('legal_status', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('granularcertificatebundle', sa.Column('device_name', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.add_column('granularcertificatebundle', sa.Column('issuing_body', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.add_column('granularcertificatebundle', sa.Column('quality_scheme_reference', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('granularcertificatebundle', sa.Column('device_type', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.add_column('granularcertificatebundle', sa.Column('registry_configuration', sa.INTEGER(), autoincrement=False, nullable=False))
    op.add_column('granularcertificatebundle', sa.Column('issuance_purpose', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('granularcertificatebundle', sa.Column('device_location', postgresql.ARRAY(sa.DOUBLE_PRECISION(precision=53)), autoincrement=False, nullable=True))
    op.add_column('granularcertificatebundle', sa.Column('country_of_issuance', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.add_column('granularcertificatebundle', sa.Column('device_production_start_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=False))
    op.add_column('granularcertificatebundle', sa.Column('issuance_datestamp', postgresql.TIMESTAMP(), autoincrement=False, nullable=False))
    op.drop_constraint('issuancemetadata_fk', 'granularcertificatebundle', type_='foreignkey')
    op.create_foreign_key('granularcertificatebundle_storage_id_fkey', 'granularcertificatebundle', 'device', ['storage_id'], ['id'])
    op.alter_column(
        "granularcertificatebundle",
        "certificate_status",
        type_=sa.String(),
        existing_nullable=False,
    )
    op.drop_column('granularcertificatebundle', 'created_at')
    op.drop_column('granularcertificatebundle', 'is_storage')
    op.drop_column('granularcertificatebundle', 'metadata_id')
    op.add_column('granularcertificateaction', sa.Column('action_id', sa.INTEGER(), autoincrement=True, nullable=False))
    op.alter_column(
        "granularcertificateaction",
        "certificate_status",
        type_=sa.String(),
        existing_nullable=False,
    )
    op.alter_column('granularcertificateaction', 'id',
               existing_type=sa.INTEGER(),
               autoincrement=True)
    op.drop_column('granularcertificateaction', 'is_deleted')
    op.drop_column('granularcertificateaction', 'created_at')
    op.drop_column('device', 'is_deleted')
    op.drop_column('device', 'is_storage')
    op.drop_column('device', 'created_at')
    op.add_column('account', sa.Column('ids', postgresql.ARRAY(sa.VARCHAR()), autoincrement=False, nullable=True))
    op.drop_column('account', 'is_deleted')
    op.drop_column('account', 'user_ids')
    op.drop_column('account', 'created_at')
    op.drop_table('issuancemetadata')
    # ### end Alembic commands ###