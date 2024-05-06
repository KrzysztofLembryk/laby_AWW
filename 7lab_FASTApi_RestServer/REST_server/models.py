from typing import List, Optional

from sqlalchemy import BigInteger, Boolean, CheckConstraint, Column, DateTime, ForeignKey, Index, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, declarative_base, mapped_column, relationship
from sqlalchemy.orm.base import Mapped

Base = declarative_base()


class AuthGroup(Base):
    __tablename__ = 'auth_group'

    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String(150), nullable=False)

    auth_user_groups: Mapped[List['AuthUserGroups']] = relationship('AuthUserGroups', uselist=True, back_populates='group')
    auth_group_permissions: Mapped[List['AuthGroupPermissions']] = relationship('AuthGroupPermissions', uselist=True, back_populates='group')


class AuthUser(Base):
    __tablename__ = 'auth_user'

    id = mapped_column(Integer, primary_key=True)
    password = mapped_column(String(128), nullable=False)
    is_superuser = mapped_column(Boolean, nullable=False)
    username = mapped_column(String(150), nullable=False)
    last_name = mapped_column(String(150), nullable=False)
    email = mapped_column(String(254), nullable=False)
    is_staff = mapped_column(Boolean, nullable=False)
    is_active = mapped_column(Boolean, nullable=False)
    date_joined = mapped_column(DateTime, nullable=False)
    first_name = mapped_column(String(150), nullable=False)
    last_login = mapped_column(DateTime)

    auth_user_groups: Mapped[List['AuthUserGroups']] = relationship('AuthUserGroups', uselist=True, back_populates='user')
    django_admin_log: Mapped[List['DjangoAdminLog']] = relationship('DjangoAdminLog', uselist=True, back_populates='user')
    obrazkiApp_svg_image_permitted_users: Mapped[List['ObrazkiAppSvgImagePermittedUsers']] = relationship('ObrazkiAppSvgImagePermittedUsers', uselist=True, back_populates='user')
    auth_user_user_permissions: Mapped[List['AuthUserUserPermissions']] = relationship('AuthUserUserPermissions', uselist=True, back_populates='user')


class DjangoContentType(Base):
    __tablename__ = 'django_content_type'
    __table_args__ = (
        Index('django_content_type_app_label_model_76bd3d3b_uniq', 'app_label', 'model', unique=True),
    )

    id = mapped_column(Integer, primary_key=True)
    app_label = mapped_column(String(100), nullable=False)
    model = mapped_column(String(100), nullable=False)

    auth_permission: Mapped[List['AuthPermission']] = relationship('AuthPermission', uselist=True, back_populates='content_type')
    django_admin_log: Mapped[List['DjangoAdminLog']] = relationship('DjangoAdminLog', uselist=True, back_populates='content_type')
    taggit_taggeditem: Mapped[List['TaggitTaggeditem']] = relationship('TaggitTaggeditem', uselist=True, back_populates='content_type')


class DjangoMigrations(Base):
    __tablename__ = 'django_migrations'

    id = mapped_column(Integer, primary_key=True)
    app = mapped_column(String(255), nullable=False)
    name = mapped_column(String(255), nullable=False)
    applied = mapped_column(DateTime, nullable=False)


class DjangoSession(Base):
    __tablename__ = 'django_session'
    __table_args__ = (
        Index('django_session_expire_date_a5c62663', 'expire_date'),
    )

    session_key = mapped_column(String(40), primary_key=True)
    session_data = mapped_column(Text, nullable=False)
    expire_date = mapped_column(DateTime, nullable=False)


class ObrazkiAppSvgImage(Base):
    __tablename__ = 'obrazkiApp_svg_image'
    __table_args__ = (
        CheckConstraint('"width" >= 0), "height" integer unsigned NOT NULL CHECK ("height" >= 0), "description" varchar(200) NOT NULL, "pub_date" datetime NOT NULL'),
    )

    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String(100), nullable=False)
    width = mapped_column(Integer, nullable=False)
    height = mapped_column(Integer, nullable=False)
    description = mapped_column(String(200), nullable=False)
    pub_date = mapped_column(DateTime, nullable=False)

    obrazkiApp_svg_image_permitted_users: Mapped[List['ObrazkiAppSvgImagePermittedUsers']] = relationship('ObrazkiAppSvgImagePermittedUsers', uselist=True, back_populates='svg_image')


class TaggitTag(Base):
    __tablename__ = 'taggit_tag'

    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String(100), nullable=False)
    slug = mapped_column(String(100), nullable=False)

    taggit_taggeditem: Mapped[List['TaggitTaggeditem']] = relationship('TaggitTaggeditem', uselist=True, back_populates='tag')


class AuthPermission(Base):
    __tablename__ = 'auth_permission'
    __table_args__ = (
        Index('auth_permission_content_type_id_2f476e4b', 'content_type_id'),
        Index('auth_permission_content_type_id_codename_01ab375a_uniq', 'content_type_id', 'codename', unique=True)
    )

    id = mapped_column(Integer, primary_key=True)
    content_type_id = mapped_column(ForeignKey('django_content_type.id'), nullable=False)
    codename = mapped_column(String(100), nullable=False)
    name = mapped_column(String(255), nullable=False)

    content_type: Mapped['DjangoContentType'] = relationship('DjangoContentType', back_populates='auth_permission')
    auth_group_permissions: Mapped[List['AuthGroupPermissions']] = relationship('AuthGroupPermissions', uselist=True, back_populates='permission')
    auth_user_user_permissions: Mapped[List['AuthUserUserPermissions']] = relationship('AuthUserUserPermissions', uselist=True, back_populates='permission')


class AuthUserGroups(Base):
    __tablename__ = 'auth_user_groups'
    __table_args__ = (
        Index('auth_user_groups_group_id_97559544', 'group_id'),
        Index('auth_user_groups_user_id_6a12ed8b', 'user_id'),
        Index('auth_user_groups_user_id_group_id_94350c0c_uniq', 'user_id', 'group_id', unique=True)
    )

    id = mapped_column(Integer, primary_key=True)
    user_id = mapped_column(ForeignKey('auth_user.id'), nullable=False)
    group_id = mapped_column(ForeignKey('auth_group.id'), nullable=False)

    group: Mapped['AuthGroup'] = relationship('AuthGroup', back_populates='auth_user_groups')
    user: Mapped['AuthUser'] = relationship('AuthUser', back_populates='auth_user_groups')


class DjangoAdminLog(Base):
    __tablename__ = 'django_admin_log'
    __table_args__ = (
        CheckConstraint('"action_flag" >= 0), "change_message" text NOT NULL, "content_type_id" integer NULL REFERENCES "django_content_type" ("id") DEFERRABLE INITIALLY DEFERRED, "user_id" integer NOT NULL REFERENCES "auth_user" ("id") DEFERRABLE INITIALLY DEFERRED, "action_time" datetime NOT NULL'),
        Index('django_admin_log_content_type_id_c4bce8eb', 'content_type_id'),
        Index('django_admin_log_user_id_c564eba6', 'user_id')
    )

    id = mapped_column(Integer, primary_key=True)
    object_repr = mapped_column(String(200), nullable=False)
    action_flag = mapped_column(Integer, nullable=False)
    change_message = mapped_column(Text, nullable=False)
    user_id = mapped_column(ForeignKey('auth_user.id'), nullable=False)
    action_time = mapped_column(DateTime, nullable=False)
    object_id = mapped_column(Text)
    content_type_id = mapped_column(ForeignKey('django_content_type.id'))

    content_type: Mapped[Optional['DjangoContentType']] = relationship('DjangoContentType', back_populates='django_admin_log')
    user: Mapped['AuthUser'] = relationship('AuthUser', back_populates='django_admin_log')


class ObrazkiAppSvgImagePermittedUsers(Base):
    __tablename__ = 'obrazkiApp_svg_image_permitted_users'
    __table_args__ = (
        Index('obrazkiApp_svg_image_permitted_users_svg_image_id_b7d71bdc', 'svg_image_id'),
        Index('obrazkiApp_svg_image_permitted_users_svg_image_id_user_id_3ba1c782_uniq', 'svg_image_id', 'user_id', unique=True),
        Index('obrazkiApp_svg_image_permitted_users_user_id_1957138a', 'user_id')
    )

    id = mapped_column(Integer, primary_key=True)
    svg_image_id = mapped_column(ForeignKey('obrazkiApp_svg_image.id'), nullable=False)
    user_id = mapped_column(ForeignKey('auth_user.id'), nullable=False)

    svg_image: Mapped['ObrazkiAppSvgImage'] = relationship('ObrazkiAppSvgImage', back_populates='obrazkiApp_svg_image_permitted_users')
    user: Mapped['AuthUser'] = relationship('AuthUser', back_populates='obrazkiApp_svg_image_permitted_users')


class TaggitTaggeditem(Base):
    __tablename__ = 'taggit_taggeditem'
    __table_args__ = (
        UniqueConstraint('content_type_id', 'object_id', 'tag_id', name='taggit_taggeditem_content_type_id_object_id_tag_id_4bb97a8e_uniq'),
        Index('taggit_tagg_content_8fc721_idx', 'content_type_id', 'object_id'),
        Index('taggit_taggeditem_content_type_id_9957a03c', 'content_type_id'),
        Index('taggit_taggeditem_object_id_e2d7d1df', 'object_id'),
        Index('taggit_taggeditem_tag_id_f4f5b767', 'tag_id')
    )

    id = mapped_column(Integer, primary_key=True)
    object_id = mapped_column(Integer, nullable=False)
    content_type_id = mapped_column(ForeignKey('django_content_type.id'), nullable=False)
    tag_id = mapped_column(ForeignKey('taggit_tag.id'), nullable=False)

    content_type: Mapped['DjangoContentType'] = relationship('DjangoContentType', back_populates='taggit_taggeditem')
    tag: Mapped['TaggitTag'] = relationship('TaggitTag', back_populates='taggit_taggeditem')


class AuthGroupPermissions(Base):
    __tablename__ = 'auth_group_permissions'
    __table_args__ = (
        Index('auth_group_permissions_group_id_b120cbf9', 'group_id'),
        Index('auth_group_permissions_group_id_permission_id_0cd325b0_uniq', 'group_id', 'permission_id', unique=True),
        Index('auth_group_permissions_permission_id_84c5c92e', 'permission_id')
    )

    id = mapped_column(Integer, primary_key=True)
    group_id = mapped_column(ForeignKey('auth_group.id'), nullable=False)
    permission_id = mapped_column(ForeignKey('auth_permission.id'), nullable=False)

    group: Mapped['AuthGroup'] = relationship('AuthGroup', back_populates='auth_group_permissions')
    permission: Mapped['AuthPermission'] = relationship('AuthPermission', back_populates='auth_group_permissions')


class AuthUserUserPermissions(Base):
    __tablename__ = 'auth_user_user_permissions'
    __table_args__ = (
        Index('auth_user_user_permissions_permission_id_1fbb5f2c', 'permission_id'),
        Index('auth_user_user_permissions_user_id_a95ead1b', 'user_id'),
        Index('auth_user_user_permissions_user_id_permission_id_14a6b632_uniq', 'user_id', 'permission_id', unique=True)
    )

    id = mapped_column(Integer, primary_key=True)
    user_id = mapped_column(ForeignKey('auth_user.id'), nullable=False)
    permission_id = mapped_column(ForeignKey('auth_permission.id'), nullable=False)

    permission: Mapped['AuthPermission'] = relationship('AuthPermission', back_populates='auth_user_user_permissions')
    user: Mapped['AuthUser'] = relationship('AuthUser', back_populates='auth_user_user_permissions')
