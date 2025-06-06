"""user_auth_fields

Revision ID: e38ea1491d9f
Revises: 700a826fe562
Create Date: 2024-12-31 14:41:20.540931

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = 'e38ea1491d9f'
down_revision: Union[str, None] = '700a826fe562'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('tokenrecords',
    sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('user_name', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('token', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('expires', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('tokenblacklist')
    op.drop_table('secureapiuser')
    op.add_column('registry_user', sa.Column('hashed_password', sqlmodel.sql.sqltypes.AutoString(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('registry_user', 'hashed_password')
    op.create_table('secureapiuser',
    sa.Column('username', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('email', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('picture', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('scopes', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('hashed_password', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('is_deleted', sa.BOOLEAN(), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('username', name='secureapiuser_pkey')
    )
    op.create_table('tokenblacklist',
    sa.Column('token', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('is_deleted', sa.BOOLEAN(), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('token', name='tokenblacklist_pkey')
    )
    op.drop_table('tokenrecords')
    # ### end Alembic commands ###